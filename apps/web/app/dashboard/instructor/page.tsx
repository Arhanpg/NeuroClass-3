import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Instructor Dashboard' }

export default async function InstructorDashboardPage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  const { data: courses } = await supabase.from('courses').select('id, name, code, term, is_archived').eq('instructor_id', session!.user.id).order('created_at', { ascending: false })
  const { data: pendingGrades } = await supabase.from('grades').select('id, project_id, created_at, projects(title)').eq('approval_status', 'PENDING_HITL').limit(5)

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-[var(--color-text)]">Instructor Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-[var(--color-surface)] rounded-xl border border-gray-200">
          <p className="text-xs text-[var(--color-text-muted)] mb-1">Active Courses</p>
          <p className="text-3xl font-bold text-[var(--color-primary)] tabular-nums">{courses?.filter(c => !c.is_archived).length ?? 0}</p>
        </div>
        <div className="p-5 bg-[var(--color-surface)] rounded-xl border border-gray-200">
          <p className="text-xs text-[var(--color-text-muted)] mb-1">Pending HiTL Reviews</p>
          <p className="text-3xl font-bold text-orange-500 tabular-nums">{pendingGrades?.length ?? 0}</p>
        </div>
        <Link href="/dashboard/courses/new" className="p-5 bg-[var(--color-primary)] text-white rounded-xl flex items-center justify-center font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
          + Create Course
        </Link>
      </div>

      {pendingGrades && pendingGrades.length > 0 && (
        <section>
          <h2 className="font-semibold text-[var(--color-text)] mb-3">⏳ Pending Grade Approvals</h2>
          <div className="space-y-2">
            {pendingGrades.map(g => (
              <Link key={g.id} href={`/dashboard/instructor/approvals/${g.id}`}
                className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl hover:shadow-sm transition-shadow">
                <span className="text-sm font-medium text-[var(--color-text)]">{(g as any).projects?.title ?? 'Unknown Project'}</span>
                <span className="text-xs text-orange-600 font-medium">Review →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-semibold text-[var(--color-text)] mb-3">My Courses</h2>
        <div className="space-y-2">
          {courses?.map(c => (
            <Link key={c.id} href={`/dashboard/courses/${c.id}`}
              className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
              <div>
                <p className="font-medium text-[var(--color-text)]">{c.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{c.code} · {c.term}</p>
              </div>
              {c.is_archived && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Archived</span>}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
