'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllUsers, deleteUser, promoteUser } from '@/store/slices/usersSlice';
import { showToast } from '@/store/slices/uiSlice';
import { selectAllUsers, selectUsersLoading } from '@/store/selectors';
import { formatDate } from '@/lib/utils';
import { ShieldCheck, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const loading = useAppSelector(selectUsersLoading);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handlePromote = async (id: string, name: string) => {
    if (!confirm(`Promote ${name} to Admin?`)) return;
    try {
      await dispatch(promoteUser(id)).unwrap();
      dispatch(showToast({ message: `${name} promoted to Admin` }));
    } catch {
      dispatch(showToast({ message: 'Failed to promote user', type: 'error' }));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await dispatch(deleteUser(id)).unwrap();
      dispatch(showToast({ message: 'User deleted' }));
    } catch {
      dispatch(showToast({ message: 'Failed to delete user', type: 'error' }));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">User management</h1>
        <p className="text-sm text-gray-500 mt-0.5">{users.length} registered users</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100 bg-gray-50">
                {['User', 'Role', 'Skills', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-xs font-bold text-brand-600 flex-shrink-0">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.role === 'ADMIN' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(u.skills || []).slice(0, 3).map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[11px]">{s}</span>
                      ))}
                      {(u.skills?.length || 0) > 3 && (
                        <span className="text-[11px] text-gray-400">+{(u.skills?.length || 0) - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-400">
                    {u.createdAt ? formatDate(u.createdAt) : '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      {u.role !== 'ADMIN' && (
                        <button onClick={() => handlePromote(u.id, u.name)}
                          className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition-colors" title="Promote to Admin">
                          <ShieldCheck size={13} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(u.id, u.name)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" title="Delete user">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}