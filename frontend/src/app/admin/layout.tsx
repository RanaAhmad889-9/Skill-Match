'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { initFromStorage } from '@/store/slices/authSlice';
import { selectUser } from '@/store/selectors';
import { Sidebar } from '@/components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    dispatch(initFromStorage());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('jobai_token');
    if (!token) { router.push('/login'); return; }
    const userStr = localStorage.getItem('jobai_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.role !== 'ADMIN') router.push('/dashboard');
      } catch {}
    }
  }, [router]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-6xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}