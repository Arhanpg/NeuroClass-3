'use client';

import Link from 'next/link';
import type { Database } from '@/lib/supabase/types';

type Course = Database['public']['Tables']['courses']['Row'];

interface Props {
  course: Course;
  role: string;
}

const PEDAGOGY_COLORS: Record<string, string> = {
  DIRECT_INSTRUCTION: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  SOCRATIC: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  GUIDED: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  FLIPPED: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  CUSTOM: 'bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
};

const PEDAGOGY_LABELS: Record<string, string> = {
  DIRECT_INSTRUCTION: 'Direct',
  SOCRATIC: 'Socratic',
  GUIDED: 'Guided',
  FLIPPED: 'Flipped',
  CUSTOM: 'Custom',
};

export function CourseCard({ course, role }: Props) {
  const colorClass = PEDAGOGY_COLORS[course.pedagogy_style] ?? PEDAGOGY_COLORS.CUSTOM;
  const labelText = PEDAGOGY_LABELS[course.pedagogy_style] ?? course.pedagogy_style;

  return (
    <Link
      href={`/dashboard/courses/${course.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
          {labelText}
        </span>
        {course.is_archived && (
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
            Archived
          </span>
        )}
      </div>

      <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
        {course.name}
      </h3>

      <div className="flex items-center gap-3 mt-3">
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
          {course.code}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{course.term}</span>
      </div>

      {role === 'INSTRUCTOR' && course.join_code && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-400 dark:text-gray-500">Join code: </span>
          <span className="text-xs font-mono font-semibold text-teal-600 dark:text-teal-400 tracking-widest">
            {course.join_code}
          </span>
        </div>
      )}
    </Link>
  );
}
