'use client';
import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminSettingsPage() {
  const dispatch = useAppDispatch();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    dispatch(showToast({ message: 'Settings saved successfully' }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure platform settings</p>
      </div>

      <div className="space-y-5">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">General</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Platform name" defaultValue="JobAI" />
            <Input label="Admin email" type="email" defaultValue="admin@jobai.com" />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">JWT expiry</label>
              <select className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-500">
                <option>7 days</option><option>30 days</option><option>1 day</option>
              </select>
            </div>
            <Input label="Max skills per user" type="number" defaultValue="20" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Skill dictionary</h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Allowed skills (comma separated)
            </label>
            <textarea
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-500 resize-none"
              rows={4}
              defaultValue="react, node.js, typescript, python, aws, docker, mongodb, graphql, kubernetes, redis, postgresql, next.js"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button>Reset</Button>
          <Button variant="primary" onClick={handleSave} loading={saving}>Save changes</Button>
        </div>
      </div>
    </div>
  );
}