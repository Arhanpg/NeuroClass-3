import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function InstructorDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || !['INSTRUCTOR', 'TEACHING_ASSISTANT'].includes(profile.role)) {
    redirect('/dashboard')
  }

  // Fetch instructor's courses
  const { data: courses } = await supabase
    .from('courses')
    .select('id, name, code, term, join_code, is_archived')
    .eq('instructor_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Instructor Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back, {profile.full_name}</p>
        </div>
        <a
          href="/dashboard/courses/new"
          className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Course
        </a>
      </div>

      {/* Stats row — full analytics wired in Phase 5 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Courses', value: courses?.filter(c => !c.is_archived).length ?? 0 },
          { label: 'Total Courses', value: courses?.length ?? 0 },
          { label: 'Pending Approvals', value: '—' },
          { label: 'Students Enrolled', value: '—' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Courses table */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-medium">Your Courses</h2>
        </div>
        {!courses || courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <p className="text-sm text-muted-foreground">No courses yet. Create your first course.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {courses.map(course => (
              <a
                key={course.id}
                href={`/dashboard/courses/${course.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{course.name}</p>
                  <p className="text-xs text-muted-foreground">{course.code} · {course.term}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{course.join_code}</span>
                  {course.is_archived && (
                    <span className="text-xs text-muted-foreground">Archived</span>
                  )}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                    <polyline points="9,18 15,12 9,6"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
