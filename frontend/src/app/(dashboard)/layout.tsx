'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { initFromStorage } from '@/store/slices/authSlice';
import { selectIsAuthenticated } from '@/store/selectors';
import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    dispatch(initFromStorage());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('jobai_token');
    if (!token) router.push('/login');
  }, [router]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-5xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}