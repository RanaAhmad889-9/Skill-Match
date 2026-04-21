'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMatches, fetchSkillGaps } from '@/store/slices/matchesSlice';
import {
  selectUser, selectTopMatches, selectSkillGaps,
  selectMatchesLoading, selectGapsLoading, selectAvgScore,
  selectHighMatches, selectMatches,
} from '@/store/selectors';
import { JobCard } from '@/components/JobCard';
import { Briefcase, Star, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const topMatches = useAppSelector(selectTopMatches);
  const allMatches = useAppSelector(selectMatches);
  const skillGaps = useAppSelector(selectSkillGaps);
  const matchesLoading = useAppSelector(selectMatchesLoading);
  const gapsLoading = useAppSelector(selectGapsLoading);
  const avgScore = useAppSelector(selectAvgScore);
  const highMatches = useAppSelector(selectHighMatches);

  useEffect(() => {
    dispatch(fetchMatches());
    dispatch(fetchSkillGaps());
  }, [dispatch]);

  const stats = [
    { label: 'Avg match score', value: `${avgScore}%`, icon: Star, color: 'text-amber-500' },
    { label: 'Jobs matched', value: allMatches.length, icon: Briefcase, color: 'text-blue-500' },
    { label: 'Skills on profile', value: user?.skills?.length || 0, icon: Zap, color: 'text-brand-500' },
    { label: '80%+ matches', value: highMatches.length, icon: TrendingUp, color: 'text-green-500' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Here are your top AI-matched jobs</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400">{label}</p>
              <Icon size={14} className={color} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Top matches</h2>
            <Link href="/jobs" className="text-xs text-brand-500 hover:text-brand-700 font-semibold">
              View all →
            </Link>
          </div>
          {matchesLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : topMatches.length > 0 ? (
            <div className="space-y-3">
              {topMatches.map((m) => (
                <JobCard key={m.job._id} result={m} compact />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-400 text-sm">
              No matches yet. Add skills to your profile to get started.
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Skill gaps</h2>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4">
            {gapsLoading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : skillGaps.length > 0 ? (
              <div className="space-y-2.5">
                {skillGaps.slice(0, 6).map((g) => (
                  <div key={g.skill} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 capitalize">{g.skill}</span>
                    </div>
                    <span className="text-xs text-gray-400">{g.jobsRequiring} jobs</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-3">No gaps found!</p>
            )}
          </div>

          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-brand-700 mb-1">Pro tip</p>
            <p className="text-xs text-brand-600 leading-relaxed">
              Upload your resume to automatically extract skills and improve your match score.
            </p>
            <Link href="/profile" className="inline-block mt-3 text-xs font-bold text-brand-600 hover:text-brand-800">
              Go to profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}