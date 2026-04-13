import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

interface MyJwtPayload extends JwtPayload {
  id: string;
  role: 'user' | 'admin';
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const secret: string = process.env.JWT_SECRET as string;
    if (!secret) {
      throw new Error('JWT secret is not defined');
    }

    const decoded = jwt.verify(token!, secret);

    if (typeof decoded === 'string') {
      throw new Error('Invalid token');
    }

    const payload = decoded as JwtPayload & {
      id: string;
      role: 'user' | 'admin';
    };
    // ✅ THIS is where req.user is created
    (req as any).user = {
      id: payload.id,
      role: payload.role,
    };

    // console.log('User:', req.user);

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
};
