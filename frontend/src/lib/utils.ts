import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScoreColor(score: number) {
  if (score >= 80)
    return { bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-500', border: 'border-green-200' };
  if (score >= 50)
    return { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-400', border: 'border-amber-200' };
  return { bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-400', border: 'border-red-200' };
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}