import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if ((err as any).name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: Object.values((err as any).errors)
        .map((e: any) => e.message)
        .join(', '),
    });
  }

  if ((err as any).code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate field value. Please use a different value.',
    });
  }

  console.error('Unexpected error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};