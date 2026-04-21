'use client';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateProfile } from '@/store/thunks/skillThunks';
import { showToast } from '@/store/slices/uiSlice';
import { selectUser, selectAuthLoading } from '@/store/selectors';
import { SkillInput } from '@/components/SkillInput';
import { ResumeUpload } from '@/components/ResumeUpload';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const handleSaveName = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await dispatch(updateProfile(name)).unwrap();
      dispatch(showToast({ message: 'Profile updated!' }));
    } catch (err: any) {
      dispatch(showToast({ message: err || 'Failed to update profile', type: 'error' }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your skills and resume</p>
      </div>

      {/* Hero */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-2xl font-bold text-brand-600 flex-shrink-0">
          {user?.name?.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-end gap-3">
            <div className="flex-1 max-w-xs">
              <Input
                label="Display name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              />
            </div>
            <Button variant="primary" onClick={handleSaveName} loading={saving}>
              Save
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {user?.email} · {user?.skills?.length || 0} skills · {user?.role}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Skills */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Your skills</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-semibold">
              {user?.skills?.length || 0} added
            </span>
          </div>
          <SkillInput
            skills={user?.skills || []}
            placeholder="Search and add skills..."
          />
        </div>

        {/* Resume */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Resume</h2>
          <ResumeUpload />
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            We parse your PDF and automatically extract skills to your profile.
          </p>
        </div>
      </div>
    </div>
  );
}