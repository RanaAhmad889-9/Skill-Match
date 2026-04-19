'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { hideToast } from '@/store/slices/uiSlice';
import { selectToast } from '@/store/selectors';
import { CheckCircle, XCircle, X } from 'lucide-react';

export function GlobalToast() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(selectToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => dispatch(hideToast()), 3500);
    return () => clearTimeout(t);
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-slide-up">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-md text-sm font-medium bg-white ${
          toast.type === 'success'
            ? 'border-green-100 text-green-700'
            : 'border-red-100 text-red-600'
        }`}
      >
        {toast.type === 'success' ? (
          <CheckCircle size={16} />
        ) : (
          <XCircle size={16} />
        )}
        {toast.message}
        <button
          onClick={() => dispatch(hideToast())}
          className="ml-2 opacity-40 hover:opacity-100 transition-opacity"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}