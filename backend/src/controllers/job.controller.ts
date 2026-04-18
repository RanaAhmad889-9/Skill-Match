import { Request, Response } from 'express';
import * as jobService from '../services/job.service';

export const createJob = async (req: Request, res: Response) => {
  const job = await jobService.createJob(req.body, req.user!._id.toString());
  res.status(201).json({ success: true, data: job });
};

export const updateJob = async (req: Request, res: Response) => {
  const job = await jobService.updateJob(req.params.id, req.body);
  res.status(200).json({ success: true, data: job });
};

export const deleteJob = async (req: Request, res: Response) => {
  await jobService.deleteJob(req.params.id);
  res.status(200).json({ success: true, message: 'Job deleted successfully' });
};

export const getAllJobs = async (req: Request, res: Response) => {
  const { status, type, search } = req.query as Record<string, string>;
  const jobs = await jobService.getAllJobs({ status, type, search });
  res.status(200).json({ success: true, data: jobs });
};

export const getJobById = async (req: Request, res: Response) => {
  const job = await jobService.getJobById(req.params.id);
  res.status(200).json({ success: true, data: job });
};

export const suggestSkills = async (req: Request, res: Response) => {
  const { q } = req.query as { q: string };
  const skills = await jobService.suggestSkills(q || '');
  res.status(200).json({ success: true, data: skills });
};