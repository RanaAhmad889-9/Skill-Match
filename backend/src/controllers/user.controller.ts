import { Request, Response } from 'express';
import { User } from '../models/User.model';
import { extractSkillsFromPDF } from '../utils/skillExtractor';
import { matchJobsForUser, getSkillGapAnalysis } from '../services/match.service';
import { AppError } from '../utils/AppError';

export const getProfile = async (req: Request, res: Response) => {
  const user = await User.findById(req.user!._id).select('-password');
  res.status(200).json({ success: true, data: user });
};

export const updateProfile = async (req: Request, res: Response) => {
  const { name } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user!._id,
    { name },
    { new: true, runValidators: true }
  ).select('-password');
  res.status(200).json({ success: true, data: user });
};

export const addSkills = async (req: Request, res: Response) => {
  const { skills } = req.body as { skills: string[] };
  if (!Array.isArray(skills) || skills.length === 0) {
    throw new AppError('Skills must be a non-empty array', 400);
  }
  const cleanSkills = skills.map((s) => s.toLowerCase().trim()).filter(Boolean);
  const user = await User.findByIdAndUpdate(
    req.user!._id,
    { $addToSet: { skills: { $each: cleanSkills } } },
    { new: true }
  ).select('-password');
  res.status(200).json({ success: true, data: user });
};

export const removeSkill = async (req: Request, res: Response) => {
  const { skill } = req.params;
  const user = await User.findByIdAndUpdate(
    req.user!._id,
    { $pull: { skills: skill.toLowerCase() } },
    { new: true }
  ).select('-password');
  res.status(200).json({ success: true, data: user });
};

export const uploadResume = async (req: Request, res: Response) => {
  if (!req.file) throw new AppError('No file uploaded', 400);
  const extractedSkills = await extractSkillsFromPDF(req.file.buffer);
  const user = await User.findByIdAndUpdate(
    req.user!._id,
    { $addToSet: { skills: { $each: extractedSkills } } },
    { new: true }
  ).select('-password');
  res.status(200).json({
    success: true,
    data: { extractedSkills, user },
  });
};

export const getMatches = async (req: Request, res: Response) => {
  const results = await matchJobsForUser(req.user!._id.toString());
  res.status(200).json({ success: true, data: results });
};

export const getSkillGap = async (req: Request, res: Response) => {
  const gaps = await getSkillGapAnalysis(req.user!._id.toString());
  res.status(200).json({ success: true, data: gaps });
};

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: users });
};

export const deleteUser = async (req: Request, res: Response) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'User deleted' });
};

export const promoteToAdmin = async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: 'ADMIN' },
    { new: true }
  ).select('-password');
  if (!user) throw new AppError('User not found', 404);
  res.status(200).json({ success: true, data: user });
};