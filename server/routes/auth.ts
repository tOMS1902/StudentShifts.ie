import { Router } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { signToken } from '../utils/token';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, role, firstName, lastName } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Account already exists for that email.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, role, firstName, lastName });
    const token = signToken({ id: user._id.toString(), role: user.role });
    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Register error', error);
    res.status(500).json({ error: 'Failed to register user.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const token = signToken({ id: user._id.toString(), role: user.role });
    res.json({ token, user });
  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ error: 'Failed to login.' });
  }
});

export default router;
