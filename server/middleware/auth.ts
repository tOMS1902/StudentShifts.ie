import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'student' | 'employer';
  };
}

const unauthorized = (res: Response) => res.status(401).json({ error: 'Unauthorized' });

export const requireAuth = (roles?: Array<'student' | 'employer'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return unauthorized(res);
    }

    const token = authHeader.substring(7);
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as AuthRequest['user'];
      if (!payload) return unauthorized(res);
      if (roles && !roles.includes(payload.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      req.user = payload;
      next();
    } catch (error) {
      console.error('JWT verification failed', error);
      return unauthorized(res);
    }
  };
};
