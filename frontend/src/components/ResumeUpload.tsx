'use client';
import { useState, useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { uploadResume } from '@/store/thunks/skillThunks';
import { showToast } from '@/store/slices/uiSlice';
import { Upload, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ResumeUpload() {
  const dispatch = useAppDispatch();
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [filename, setFilename] = useState('');
  const [extractedCount, setExtractedCount] = useState(0);

  const handleUpload = useCallback(
    async (file: File) => {
      if (file.type !== 'application/pdf') { setError('Only PDF files allowed'); return; }
      if (file.size > 5 * 1024 * 1024) { setError('Max file size is 5MB'); return; }

      setFilename(file.name);
      setUploading(true);
      setDone(false);
      setError('');
      setProgress(0);

      try {
        const result = await dispatch(
          uploadResume({ file, onProgress: setProgress })
        ).unwrap();
        setDone(true);
        setExtractedCount(result.length);
        dispatch(showToast({ message: `${result.length} skills extracted from resume` }));
      } catch (err: any) {
        setError(typeof err === 'string' ? err : 'Upload failed');
        dispatch(showToast({ message: 'Resume upload failed', type: 'error' }));
      } finally {
        setUploading(false);
      }
    },
    [dispatch]
  );

  return (
    <div>
      <div
        className={cn(
          'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
          dragging ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-400 hover:bg-gray-50',
          done && 'border-green-300 bg-green-50'
        )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) handleUpload(f);
        }}
        onClick={() => document.getElementById('resume-file-input')?.click()}
      >
        <input
          id="resume-file-input"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
            e.target.value = '';
          }}
        />

        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-white border border-gray-100">
          {done ? (
            <CheckCircle size={22} className="text-green-500" />
          ) : (
            <Upload size={22} className="text-gray-400" />
          )}
        </div>

        <p className="font-semibold text-gray-700 text-sm">
          {done ? 'Resume uploaded!' : 'Drop your resume here'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {done
            ? `${extractedCount} skills extracted from ${filename}`
            : 'PDF only · max 5MB · or click to browse'}
        </p>

        {uploading && (
          <div className="mt-5 text-left">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span className="flex items-center gap-1.5 truncate">
                <FileText size={12} />{filename}
              </span>
              <span className="flex-shrink-0 ml-2">{progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-xs text-red-500">
          <AlertCircle size={12} />{error}
        </div>
      )}
    </div>
  );
}