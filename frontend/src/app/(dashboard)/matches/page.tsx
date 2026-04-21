'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMatches } from '@/store/slices/matchesSlice';
import { selectMatches, selectMatchesLoading } from '@/store/selectors';
import { JobCard } from '@/components/JobCard';
import { MatchResult } from '@/types';

export default function MatchesPage() {
  const dispatch = useAppDispatch();
  const results = useAppSelector(selectMatches);
  const loading = useAppSelector(selectMatchesLoading);

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  const high = results.filter((r) => r.score >= 80);
  const mid = results.filter((r) => r.score >= 50 && r.score < 80);
  const low = results.filter((r) => r.score < 50);

  const Section = ({ title, items, color }: { title: string; items: MatchResult[]; color: string }) =>
    items.length > 0 ? (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {title} ({items.length})
          </h2>
        </div>
        <div className="space-y-3">
          {items.map((r) => <JobCard key={r.job._id} result={r} />)}
        </div>
      </div>
    ) : null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">My Matches</h1>
        <p className="text-sm text-gray-500 mt-0.5">Jobs ranked by skill match percentage</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <>
          <Section title="Strong match" items={high} color="bg-green-500" />
          <Section title="Good match" items={mid} color="bg-amber-400" />
          <Section title="Partial match" items={low} color="bg-red-400" />
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400">
          <p className="text-sm font-semibold">No matches yet</p>
          <p className="text-xs mt-1">Add skills to your profile to see job matches</p>
        </div>
      )}
    </div>
  );
}