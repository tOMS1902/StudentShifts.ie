import { Router } from 'express';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import { User } from '../models/User.js';
import { signToken } from '../utils/token.js';

const router = Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required'
    }),
  role: Joi.string().valid('student', 'employer').required()
    .messages({
      'any.only': 'Role must be either student or employer',
      'any.required': 'Role is required'
    }),
  firstName: Joi.string().min(2).max(50).trim().optional(),
  lastName: Joi.string().min(2).max(50).trim().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string().required()
    .messages({
      'any.required': 'Password is required'
    })
});

router.post('/register', async (req, res) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({ error: errors.join('. ') });
    }

    const { email, password, role, firstName, lastName } = value;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Account already exists for that email.' });
    }

    const passwordHash = await bcrypt.hash(password, 12); // Increased from 10 to 12 rounds
    const user = await User.create({ email, passwordHash, role, firstName, lastName });
    const token = signToken({ id: user._id.toString(), role: user.role });

    // Don't send password hash to client
    const userResponse = {
      _id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };

    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error('Register error', error);
    res.status(500).json({ error: 'Failed to register user.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    const user = await User.findOne({ email });
    if (!user) {
      // Use same error message for user not found and wrong password (security best practice)
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = signToken({ id: user._id.toString(), role: user.role });

    // Don't send password hash to client
    const userResponse = {
      _id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };

    res.json({ token, user: userResponse });
  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ error: 'Failed to login.' });
  }
});

export default router;
