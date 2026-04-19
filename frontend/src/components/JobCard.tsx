'use client';
import { MatchResult } from '@/types';
import { getScoreColor } from '@/lib/utils';
import { MapPin, Briefcase, DollarSign } from 'lucide-react';

interface JobCardProps {
  result: MatchResult;
  compact?: boolean;
}

export function JobCard({ result, compact = false }: JobCardProps) {
  const { job, score, matchedSkills, missingSkills } = result;
  const colors = getScoreColor(score);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer group animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm group-hover:text-brand-600 transition-colors truncate">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{job.company}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${colors.bg} ${colors.text}`}
        >
          {score}% match
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-3 mb-3">
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <MapPin size={11} />{job.location}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Briefcase size={11} />{job.type}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <DollarSign size={11} />{job.salary}
          </span>
        )}
      </div>

      {!compact && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        {matchedSkills.slice(0, compact ? 3 : 6).map((s) => (
          <span key={s} className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[11px] font-medium">
            {s}
          </span>
        ))}
        {missingSkills.slice(0, compact ? 2 : 4).map((s) => (
          <span key={s} className="px-2.5 py-0.5 bg-red-50 text-red-500 rounded-full text-[11px] font-medium">
            {s}
          </span>
        ))}
      </div>

      <div>
        <div className="flex justify-between text-[11px] mb-1.5">
          <span className="text-gray-400">
            {matchedSkills.length}/{job.requiredSkills.length} skills matched
          </span>
          {missingSkills.length > 0 && (
            <span className="text-red-400">
              Missing: {missingSkills.slice(0, 2).join(', ')}
              {missingSkills.length > 2 ? '...' : ''}
            </span>
          )}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}