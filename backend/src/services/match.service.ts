import { Job, IJob } from '../models/Job.model';
import { User } from '../models/User.model';

export interface MatchResult {
  job: IJob;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export const matchJobsForUser = async (userId: string): Promise<MatchResult[]> => {
  const user = await User.findById(userId).select('skills');
  if (!user) return [];

  const jobs = await Job.find({ status: 'Active' });
  const userSkillSet = new Set(user.skills.map((s) => s.toLowerCase()));

  const results: MatchResult[] = jobs.map((job) => {
    const required = job.requiredSkills.map((s) => s.toLowerCase());
    const matchedSkills = required.filter((s) => userSkillSet.has(s));
    const missingSkills = required.filter((s) => !userSkillSet.has(s));
    const score = required.length
      ? Math.round((matchedSkills.length / required.length) * 100)
      : 0;
    return { job, score, matchedSkills, missingSkills };
  });

  return results.sort((a, b) => b.score - a.score);
};

export const getSkillGapAnalysis = async (userId: string) => {
  const results = await matchJobsForUser(userId);
  const gapFreq: Record<string, number> = {};

  results.forEach(({ missingSkills }) => {
    missingSkills.forEach((s) => {
      gapFreq[s] = (gapFreq[s] || 0) + 1;
    });
  });

  return Object.entries(gapFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, jobsRequiring: count }));
};