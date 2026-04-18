import { Request, Response } from 'express';
import { z } from 'zod';
import * as authService from '../services/auth.service';
import { AppError } from '../utils/AppError';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.errors[0].message, 400);
  }
  const { name, email, password } = parsed.data;
  const result = await authService.registerUser(name, email, password);
  res.status(201).json({ success: true, data: result });
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError('Invalid email or password format', 400);
  }
  const { email, password } = parsed.data;
  const result = await authService.loginUser(email, password);
  res.status(200).json({ success: true, data: result });
};

export const getMe = async (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: req.user });
};