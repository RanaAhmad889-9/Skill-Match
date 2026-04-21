'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllJobs } from '@/store/slices/jobsSlice';
import { selectAllJobs, selectJobsLoading } from '@/store/selectors';

export default function AdminAnalyticsPage() {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(selectAllJobs);
  const loading = useAppSelector(selectJobsLoading);

  useEffect(() => {
    dispatch(fetchAllJobs());
  }, [dispatch]);

  const skillFreq: Record<string, number> = {};
  jobs.forEach((j) => j.requiredSkills.forEach((s) => { skillFreq[s] = (skillFreq[s] || 0) + 1; }));
  const topSkills = Object.entries(skillFreq).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const maxCount = topSkills[0]?.[1] || 1;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Platform skill and job insights</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-5">Most demanded skills</h2>
          {loading ? (
            <div className="space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="h-5 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : (
            <div className="space-y-3">
              {topSkills.map(([skill, count]) => (
                <div key={skill} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-24 flex-shrink-0 capitalize">{skill}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${Math.round((count / maxCount) * 100)}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-5 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-5">Jobs by type</h2>
          <div className="space-y-3">
            {['Full-time', 'Part-time', 'Contract', 'Remote'].map((type) => {
              const count = jobs.filter((j) => j.type === type).length;
              const pct = jobs.length ? Math.round((count / jobs.length) * 100) : 0;
              return (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-700">{type}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}