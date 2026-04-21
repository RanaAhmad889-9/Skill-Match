'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMatches } from '@/store/slices/matchesSlice';
import { selectMatches, selectMatchesLoading } from '@/store/selectors';
import { JobCard } from '@/components/JobCard';
import { Search } from 'lucide-react';

const FILTERS = ['All', 'Remote', 'Full-time', 'Part-time', 'Contract', '80%+ Match', '50%+ Match'];

export default function JobsPage() {
  const dispatch = useAppDispatch();
  const results = useAppSelector(selectMatches);
  const loading = useAppSelector(selectMatchesLoading);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  const filtered = results.filter((r) => {
    const matchesFilter =
      filter === 'All' ? true :
      filter === '80%+ Match' ? r.score >= 80 :
      filter === '50%+ Match' ? r.score >= 50 :
      r.job.location === filter || r.job.type === filter;

    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.job.title.toLowerCase().includes(q) ||
      r.job.company.toLowerCase().includes(q) ||
      r.job.requiredSkills.some((s) => s.includes(q));

    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Browse Jobs</h1>
        <p className="text-sm text-gray-500 mt-0.5">{results.length} jobs matched to your skills</p>
      </div>

      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by title, company, or skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-500 transition-colors"
        />
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === f
                ? 'bg-brand-500 text-white border-transparent'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <JobCard key={r.job._id} result={r} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <p className="text-sm font-semibold">No jobs found</p>
              <p className="text-xs mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}