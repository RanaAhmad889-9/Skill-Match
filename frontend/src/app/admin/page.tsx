'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllJobs } from '@/store/slices/jobsSlice';
import { fetchAllUsers } from '@/store/slices/usersSlice';
import { selectAllJobs, selectJobsLoading, selectAllUsers } from '@/store/selectors';
import { Briefcase, Users, Star, Activity } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(selectAllJobs);
  const users = useAppSelector(selectAllUsers);
  const loading = useAppSelector(selectJobsLoading);

  useEffect(() => {
    dispatch(fetchAllJobs());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const activeJobs = jobs.filter((j) => j.status === 'Active').length;
  const uniqueSkills = [...new Set(jobs.flatMap((j) => j.requiredSkills))].length;

  const stats = [
    { label: 'Total jobs', value: jobs.length, icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active jobs', value: activeJobs, icon: Activity, color: 'bg-green-50 text-green-600' },
    { label: 'Total users', value: users.length, icon: Users, color: 'bg-purple-50 text-purple-600' },
    { label: 'Unique skills', value: uniqueSkills, icon: Star, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Platform overview</p>
        </div>
        <Link
          href="/admin/jobs"
          className="text-sm bg-brand-500 text-white px-4 py-2 rounded-xl hover:bg-brand-700 transition-colors font-semibold"
        >
          + Post new job
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400">{label}</p>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={13} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Recent jobs</h2>
            <Link href="/admin/jobs" className="text-xs text-brand-500 hover:text-brand-700 font-semibold">
              Manage all →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-1">
              {jobs.slice(0, 5).map((j) => (
                <div key={j._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{j.title}</p>
                    <p className="text-xs text-gray-400">{j.company}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${j.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {j.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Recent users</h2>
            <Link href="/admin/users" className="text-xs text-brand-500 hover:text-brand-700 font-semibold">
              Manage all →
            </Link>
          </div>
          <div className="space-y-1">
            {users.slice(0, 5).map((u) => (
              <div key={u.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center text-[10px] font-bold text-brand-600 flex-shrink-0">
                  {u.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{u.name}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${u.role === 'ADMIN' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-600'}`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}