import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ProjectsPage({ params }: { params: { courseId: string } }) {
  const supabase = createServerClient()
  const { data: projects } = await supabase
    .from('projects').select('*').eq('course_id', params.courseId).order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[var(--color-text)]">Projects</h1>
        <Link href={`/dashboard/courses/${params.courseId}/projects/new`}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
          + New Project
        </Link>
      </div>
      {!projects?.length ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          <p className="font-medium">No projects yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map(p => (
            <Link key={p.id} href={`/dashboard/courses/${params.courseId}/projects/${p.id}`}
              className="block p-5 bg-[var(--color-surface)] rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-[var(--color-text)]">{p.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{p.grading_status}</span>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2">{p.description}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-[var(--color-text-muted)]">
                <span>Team size: {p.team_size}</span>
                <span>Weight: {p.grade_weight_pct}%</span>
                <span>Due: {new Date(p.deadline).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
