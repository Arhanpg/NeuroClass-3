'use client';

import type { Database } from '@/lib/supabase/types';

type Lecture = Database['public']['Tables']['lectures']['Row'];

interface Props {
  lecture: Lecture;
}

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    icon: '⏳',
  },
  PROCESSING: {
    label: 'Processing',
    color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    icon: '🔄',
  },
  DONE: {
    label: 'Embedded',
    color: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    icon: '✅',
  },
  FAILED: {
    label: 'Failed',
    color: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    icon: '❌',
  },
};

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function LectureCard({ lecture }: Props) {
  const status = STATUS_CONFIG[lecture.embedding_status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.PENDING;

  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <div className="flex items-center gap-4">
        <div className="text-2xl">
          {lecture.file_type === 'PDF' ? '📎' : '📝'}
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white text-sm">{lecture.title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {lecture.file_type} &bull; Uploaded {formatDate(lecture.uploaded_at)}
            {lecture.chunk_count > 0 && (
              <> &bull; {lecture.chunk_count} chunks</>
            )}
          </div>
        </div>
      </div>

      <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
        <span>{status.icon}</span>
        <span>{status.label}</span>
      </div>
    </div>
  );
}
