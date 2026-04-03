import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CourseCard } from '@/components/courses/CourseCard'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Courses | NeuroClass' }

export default async function CoursesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isInstructor = profile?.role === 'INSTRUCTOR' || profile?.role === 'ADMIN'

  let courses: any[] = []

  if (isInstructor) {
    const { data } = await supabase
      .from('courses').select('*').eq('instructor_id', user.id).order('created_at', { ascending: false })
    courses = data ?? []
  } else {
    const { data: enrollments } = await supabase
      .from('enrollments').select('course_id').eq('student_id', user.id)
    const ids = enrollments?.map((e: any) => e.course_id) ?? []
    if (ids.length > 0) {
      const { data } = await supabase.from('courses').select('*').in('id', ids)
      courses = data ?? []
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Courses</h1>
        <div className="flex gap-2">
          {isInstructor && (
            <Link
              href="/courses/new"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + New Course
            </Link>
          )}
          {!isInstructor && (
            <Link
              href="/enroll"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Enroll
            </Link>
          )}
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-lg font-semibold text-white mb-2">
            {isInstructor ? 'No courses yet' : 'Not enrolled in any courses'}
          </h2>
          <p className="text-slate-400 text-sm max-w-xs">
            {isInstructor
              ? 'Create your first course to get started.'
              : 'Ask your instructor for a join code to enroll.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} isInstructor={isInstructor} />
          ))}
        </div>
      )}
    </div>
  )
}
