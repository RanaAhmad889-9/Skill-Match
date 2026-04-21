'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllJobs, createJob, updateJob, deleteJob } from '@/store/slices/jobsSlice';
import { showToast } from '@/store/slices/uiSlice';
import { selectAllJobs, selectJobsLoading } from '@/store/selectors';
import { Job } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

interface JobForm {
  title: string; company: string; description: string;
  location: string; type: string; status: string;
  salary: string; requiredSkills: string[];
}

const EMPTY: JobForm = {
  title: '', company: '', description: '',
  location: 'Remote', type: 'Full-time', status: 'Active',
  salary: '', requiredSkills: [],
};

export default function AdminJobsPage() {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(selectAllJobs);
  const loading = useAppSelector(selectJobsLoading);
  const [modal, setModal] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [form, setForm] = useState<JobForm>(EMPTY);
  const [skillInput, setSkillInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAllJobs());
  }, [dispatch]);

  const openCreate = () => { setEditJob(null); setForm(EMPTY); setSkillInput(''); setModal(true); };

  const openEdit = (j: Job) => {
    setEditJob(j);
    setForm({
      title: j.title, company: j.company, description: j.description,
      location: j.location, type: j.type, status: j.status,
      salary: j.salary, requiredSkills: [...j.requiredSkills],
    });
    setSkillInput('');
    setModal(true);
  };

  const addSkillToForm = () => {
    const s = skillInput.trim().toLowerCase();
    if (s && !form.requiredSkills.includes(s))
      setForm((f) => ({ ...f, requiredSkills: [...f.requiredSkills, s] }));
    setSkillInput('');
  };

  const removeSkillFromForm = (s: string) =>
    setForm((f) => ({ ...f, requiredSkills: f.requiredSkills.filter((x) => x !== s) }));

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.company.trim() || !form.description.trim()) {
      dispatch(showToast({ message: 'Title, company and description are required', type: 'error' }));
      return;
    }
    setSubmitting(true);
    try {
      if (editJob) {
        await dispatch(updateJob({ id: editJob._id, jobData: form })).unwrap();
        dispatch(showToast({ message: 'Job updated successfully' }));
      } else {
        await dispatch(createJob(form as any)).unwrap();
        dispatch(showToast({ message: 'Job posted successfully' }));
      }
      setModal(false);
    } catch (err: any) {
      dispatch(showToast({ message: err || 'Failed to save job', type: 'error' }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job? This cannot be undone.')) return;
    try {
      await dispatch(deleteJob(id)).unwrap();
      dispatch(showToast({ message: 'Job deleted' }));
    } catch {
      dispatch(showToast({ message: 'Failed to delete job', type: 'error' }));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Job management</h1>
          <p className="text-sm text-gray-500 mt-0.5">{jobs.length} total job postings</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus size={15} /> Post new job
        </Button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100 bg-gray-50">
                {['Title & Company', 'Type', 'Status', 'Skills', 'Applicants', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0">
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-gray-800">{j.title}</p>
                    <p className="text-xs text-gray-400">{j.company} · {j.location}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">{j.type}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${j.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {j.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1 flex-wrap max-w-[180px]">
                      {j.requiredSkills.slice(0, 2).map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[11px] font-medium">{s}</span>
                      ))}
                      {j.requiredSkills.length > 2 && (
                        <span className="text-[11px] text-gray-400">+{j.requiredSkills.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{j.applicantCount}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(j)} className="p-1.5 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => handleDelete(j._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No jobs posted yet. Click "Post new job" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">
                {editJob ? 'Edit job posting' : 'Post new job'}
              </h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Job title *" placeholder="Senior Engineer" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <Input label="Company *" placeholder="Stripe" value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <Input label="Location" placeholder="Remote" value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Job type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-500">
                    {['Full-time', 'Part-time', 'Contract', 'Remote'].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <Input label="Salary range" placeholder="$80k – $120k" value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-500">
                    <option>Active</option><option>Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-500 resize-none"
                  rows={3} placeholder="Describe the role, responsibilities..." />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Required skills</label>
                <div className="flex gap-2 mb-2">
                  <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkillToForm(); } }}
                    placeholder="e.g. React, Node.js — press Enter"
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-500" />
                  <Button onClick={addSkillToForm} size="sm">Add</Button>
                </div>
                {form.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {form.requiredSkills.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-semibold">
                        {s}
                        <button onClick={() => removeSkillFromForm(s)} className="hover:text-red-500 transition-colors">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 p-6 border-t border-gray-100">
              <Button onClick={() => setModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} loading={submitting}>
                {editJob ? 'Save changes' : 'Post job'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}