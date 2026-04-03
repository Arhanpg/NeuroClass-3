import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const supabase = createServerClient()
  const { data: course } = await supabase
    .from('courses')
    .select('*, profiles!instructor_id(full_name)')
    .eq('id', params.courseId)
    .single()

  if (!course) notFound()

  const { data: lectures } = await supabase.from('lectures').select('*').eq('course_id', course.id).order('uploaded_at', { ascending: false })
  const { data: projects } = await supabase.from('projects').select('*').eq('course_id', course.id).order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text)]">{course.name}</h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">{course.code} · {course.term}</p>
          <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-teal-100 text-teal-800">{course.pedagogy_style.replace('_', ' ')}</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--color-text-muted)]">Join Code</p>
          <code className="font-mono font-bold text-[var(--color-primary)] text-lg">{course.join_code}</code>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="bg-[var(--color-surface)] rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[var(--color-text)]">Lectures</h2>
            <Link href={`/dashboard/courses/${course.id}/lectures`} className="text-xs text-[var(--color-primary)] hover:underline">View all →</Link>
          </div>
          {!lectures?.length ? <p className="text-sm text-[var(--color-text-muted)]">No lectures uploaded yet.</p>
            : lectures.slice(0, 3).map(l => (
              <div key={l.id} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
                <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-mono">{l.file_type}</span>
                <span className="text-sm text-[var(--color-text)]">{l.title}</span>
                <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full" style={{ background: l.embedding_status === 'DONE' ? '#d1fae5' : '#fef9c3', color: l.embedding_status === 'DONE' ? '#065f46' : '#713f12' }}>{l.embedding_status}</span>
              </div>
            ))
          }
        </section>

        <section className="bg-[var(--color-surface)] rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[var(--color-text)]">Projects</h2>
            <Link href={`/dashboard/courses/${course.id}/projects`} className="text-xs text-[var(--color-primary)] hover:underline">View all →</Link>
          </div>
          {!projects?.length ? <p className="text-sm text-[var(--color-text-muted)]">No projects created yet.</p>
            : projects.slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-[var(--color-text)]">{p.title}</span>
                <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700">{p.grading_status}</span>
              </div>
            ))
          }
        </section>
      </div>

      <div className="flex gap-3">
        <Link href={`/dashboard/courses/${course.id}/tutor`}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
          🤖 AI Tutor
        </Link>
        <Link href={`/dashboard/courses/${course.id}/leaderboard`}
          className="px-4 py-2 border border-gray-300 text-[var(--color-text)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          🏆 Leaderboard
        </Link>
        <Link href={`/dashboard/courses/${course.id}/grades`}
          className="px-4 py-2 border border-gray-300 text-[var(--color-text)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          📊 Grades
        </Link>
      </div>
    </div>
  )
}
