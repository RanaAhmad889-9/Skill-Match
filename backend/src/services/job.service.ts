import { Job, IJob } from '../models/Job.model';
import { AppError } from '../utils/AppError';
import mongoose from 'mongoose';

export const createJob = async (
  data: Partial<IJob>,
  adminId: string
): Promise<IJob> => {
  return Job.create({ ...data, createdBy: adminId });
};

export const updateJob = async (
  jobId: string,
  data: Partial<IJob>
): Promise<IJob> => {
  if (!mongoose.isValidObjectId(jobId))
    throw new AppError('Invalid job ID', 400);
  const job = await Job.findByIdAndUpdate(jobId, data, {
    new: true,
    runValidators: true,
  });
  if (!job) throw new AppError('Job not found', 404);
  return job;
};

export const deleteJob = async (jobId: string): Promise<void> => {
  if (!mongoose.isValidObjectId(jobId))
    throw new AppError('Invalid job ID', 400);
  const job = await Job.findByIdAndDelete(jobId);
  if (!job) throw new AppError('Job not found', 404);
};

export const getAllJobs = async (filters: {
  status?: string;
  type?: string;
  search?: string;
}) => {
  const query: Record<string, unknown> = {};
  if (filters.status) query.status = filters.status;
  if (filters.type) query.type = filters.type;
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { company: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
      { requiredSkills: { $in: [new RegExp(filters.search, 'i')] } },
    ];
  }
  return Job.find(query).sort({ createdAt: -1 });
};

export const getJobById = async (jobId: string): Promise<IJob> => {
  if (!mongoose.isValidObjectId(jobId))
    throw new AppError('Invalid job ID', 400);
  const job = await Job.findById(jobId);
  if (!job) throw new AppError('Job not found', 404);
  return job;
};

export const suggestSkills = async (query: string): Promise<string[]> => {
  if (!query || query.length < 1) return [];
  const jobs = await Job.find({
    requiredSkills: { $regex: query, $options: 'i' },
  }).select('requiredSkills');

  const allSkills = jobs.flatMap((j) => j.requiredSkills);
  const unique = [...new Set(allSkills)].filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );
  return unique.slice(0, 10);
};