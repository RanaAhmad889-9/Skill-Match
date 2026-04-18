export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  skills: string[];
  createdAt?: string;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  status: 'Active' | 'Draft' | 'Closed';
  salary: string;
  requiredSkills: string[];
  applicantCount: number;
  createdAt: string;
}

export interface MatchResult {
  job: Job;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface SkillGap {
  skill: string;
  jobsRequiring: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}