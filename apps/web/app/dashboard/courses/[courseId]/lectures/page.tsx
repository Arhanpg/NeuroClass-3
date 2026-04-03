import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function LecturesPage({ params }: { params: { courseId: string } }) {
  const supabase = createServerClient()
  const { data: lectures } = await supabase
    .from('lectures').select('*').eq('course_id', params.courseId).order('uploaded_at', { ascending: false })

  const STATUS_COLORS: Record<string, string> = {
    DONE: 'bg-green-100 text-green-700',
    PROCESSING: 'bg-yellow-100 text-yellow-700',
    PENDING: 'bg-gray-100 text-gray-600',
    FAILED: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[var(--color-text)]">Lecture Notes</h1>
        <Link href={`/dashboard/courses/${params.courseId}/lectures/upload`}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
          + Upload
        </Link>
      </div>
      {!lectures?.length ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          <p className="font-medium">No lectures uploaded yet</p>
          <p className="text-sm mt-1">Upload PDF or Markdown files to power the AI Tutor.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lectures.map(l => (
            <div key={l.id} className="flex items-center gap-3 p-4 bg-[var(--color-surface)] rounded-xl border border-gray-200">
              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-mono">{l.file_type}</span>
              <div className="flex-1">
                <p className="font-medium text-[var(--color-text)] text-sm">{l.title}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{l.chunk_count} chunks</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[l.embedding_status] ?? STATUS_COLORS.PENDING}`}>{l.embedding_status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
