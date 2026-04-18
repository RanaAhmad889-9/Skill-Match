import { User } from '../models/User.model';
import { signToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError('Email already in use', 409);

  const user = await User.create({ name, email, password });
  const token = signToken({ id: user._id.toString(), role: user.role });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
    },
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AppError('Invalid email or password', 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  const token = signToken({ id: user._id.toString(), role: user.role });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
    },
  };
};