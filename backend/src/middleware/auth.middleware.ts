import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/User.model';
import { AppError } from '../utils/AppError';

export const authenticate = async (
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return next(new AppError('No token provided. Please log in.', 401));
    }

    const token = authHeader.split(' ')[1];

    try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return next(new AppError('User no longer exists', 401));
    req.user = user;
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }

}