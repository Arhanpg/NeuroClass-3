import { redirect } from 'next/navigation'
import { createServerClient as createClient } from '@/lib/supabase/server'
import { InstructorDashboard } from '@/components/dashboard/InstructorDashboard'
import { StudentDashboard } from '@/components/dashboard/StudentDashboard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  if (profile.role === 'INSTRUCTOR') {
    const { data: courses } = await supabase
      .from('courses')
      .select('id, name, code, term, join_code, enrollment_cap, is_archived, created_at')
      .eq('instructor_id', user.id)
      .eq('is_archived', false)
      .order('created_at', { ascending: false })

    const courseIds = (courses ?? []).map((c) => c.id)

    const { data: enrollments } = courseIds.length
      ? await supabase
          .from('enrollments')
          .select('course_id')
          .in('course_id', courseIds)
      : { data: [] }

    const enrollmentCounts: Record<string, number> = {}
    for (const e of enrollments ?? []) {
      enrollmentCounts[e.course_id] = (enrollmentCounts[e.course_id] ?? 0) + 1
    }

    return (
      <InstructorDashboard
        profile={profile}
        courses={courses ?? []}
        enrollmentCounts={enrollmentCounts}
      />
    )
  }

  // STUDENT view
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('joined_at, courses(id, name, code, term, instructor_id, profiles!instructor_id(full_name))')
    .eq('student_id', user.id)
    .order('joined_at', { ascending: false })

  return (
    <StudentDashboard
      profile={profile}
      enrollments={enrollments ?? []}
    />
  )
}
