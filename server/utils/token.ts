import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: string;
  role: 'student' | 'employer';
}

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }
  return secret;
};

export const signToken = (payload: TokenPayload) => {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' });
};
