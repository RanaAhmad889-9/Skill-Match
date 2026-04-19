'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addSkill, removeSkill } from '@/store/thunks/skillThunks';
import { showToast } from '@/store/slices/uiSlice';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';
import { X, Plus } from 'lucide-react';

interface SkillInputProps {
  skills: string[];
  placeholder?: string;
  disabled?: boolean;
}

export function SkillInput({ skills, placeholder = 'Type a skill...', disabled = false }: SkillInputProps) {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [addingSkill, setAddingSkill] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchSuggestions = useCallback(
    async (q: string) => {
      if (!q.trim()) { setSuggestions([]); setOpen(false); return; }
      try {
        const { data } = await api.get(`/jobs/suggest-skills?q=${encodeURIComponent(q)}`);
        const filtered = (data.data as string[]).filter((s) => !skills.includes(s));
        setSuggestions(filtered);
        setOpen(filtered.length > 0);
      } catch {
        setSuggestions([]);
      }
    },
    [skills]
  );

  useEffect(() => {
    const t = setTimeout(() => fetchSuggestions(query), 200);
    return () => clearTimeout(t);
  }, [query, fetchSuggestions]);

  const handleAdd = async (skill: string) => {
    const trimmed = skill.trim().toLowerCase();
    if (!trimmed || skills.includes(trimmed)) return;
    setAddingSkill(trimmed);
    setQuery('');
    setOpen(false);
    try {
      await dispatch(addSkill(trimmed)).unwrap();
      dispatch(showToast({ message: `Added "${trimmed}"` }));
    } catch (err: any) {
      dispatch(showToast({ message: err || 'Failed to add skill', type: 'error' }));
    } finally {
      setAddingSkill('');
    }
  };

  const handleRemove = async (skill: string) => {
    try {
      await dispatch(removeSkill(skill)).unwrap();
    } catch {
      dispatch(showToast({ message: 'Failed to remove skill', type: 'error' }));
    }
  };

  return (
    <div className="space-y-2">
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-600 border border-brand-100 rounded-full text-xs font-medium"
            >
              {s}
              {!disabled && (
                <button
                  onClick={() => handleRemove(s)}
                  className="opacity-40 hover:opacity-100 transition-opacity hover:text-red-500"
                >
                  <X size={11} />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {!disabled && (
        <div className="relative" ref={wrapRef}>
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-2 bg-gray-50 border rounded-xl transition-all',
              focused ? 'border-brand-500 ring-2 ring-brand-50' : 'border-gray-200'
            )}
          >
            <Plus size={14} className="text-gray-300 flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) { e.preventDefault(); handleAdd(query); }
                if (e.key === 'Escape') setOpen(false);
              }}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder:text-gray-400"
            />
            {addingSkill && (
              <span className="text-xs text-gray-400 animate-pulse">Adding...</span>
            )}
          </div>

          {open && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-100 rounded-xl z-50 overflow-hidden shadow-lg">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleAdd(s)}
                  className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors text-gray-700 border-b border-gray-50 last:border-0"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}   