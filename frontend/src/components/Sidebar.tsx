'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { selectUser } from '@/store/selectors';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Briefcase, User, Star,
  Settings, LogOut, Users, BarChart2, Zap,
} from 'lucide-react';

const userNav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/jobs', icon: Briefcase, label: 'Browse Jobs' },
  { href: '/matches', icon: Star, label: 'My Matches' },
  { href: '/profile', icon: User, label: 'Profile' },
];

const adminNav = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { href: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const navItems = user?.role === 'ADMIN' ? adminNav : userNav;

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-[15px]">SkillMatch</span>
          {user?.role === 'ADMIN' && (
            <span className="text-[9px] px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded font-bold ml-auto uppercase tracking-wide">
              Admin
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="p-3 flex-1 overflow-y-auto">
        {user?.role === 'ADMIN' && (
          <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest px-2 py-1 mb-1">
            Admin Panel
          </p>
        )}
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-all mb-0.5 group',
                isActive
                  ? 'bg-brand-50 text-brand-600 font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              )}
            >
              <Icon
                size={15}
                className={cn(
                  isActive ? 'text-brand-500' : 'text-gray-400 group-hover:text-gray-600'
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center text-[11px] font-bold text-brand-600 flex-shrink-0">
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl w-full transition-all"
        >
          <LogOut size={13} />
          Log out
        </button>
      </div>
    </aside>
  );
}