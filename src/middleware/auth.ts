import jwt from 'jsonwebtoken';
import { Types } from 'mongoose'
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

export const generateToken = (userId: Types.ObjectId | string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' });
};

interface JwtPayload {
  id: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Access denied' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
};