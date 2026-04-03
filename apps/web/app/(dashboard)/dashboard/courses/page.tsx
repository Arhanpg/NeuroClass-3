import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  let courses: { id: string; title: string; description: string | null; is_active: boolean }[] = []

  if (profile?.role === 'instructor') {
    const { data } = await supabase
      .from('courses')
      .select('id, title, description, is_active')
      .eq('instructor_id', user.id)
      .order('created_at', { ascending: false })
    courses = data ?? []
  } else {
    const { data } = await supabase
      .from('enrollments')
      .select('course:courses(id, title, description, is_active)')
      .eq('student_id', user.id)
    courses = (data ?? []).map((e) => e.course as typeof courses[0]).filter(Boolean)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Courses</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {profile?.role === 'instructor' ? 'Courses you teach' : 'Courses you\'re enrolled in'}
          </p>
        </div>
        {profile?.role === 'instructor' && (
          <Link
            href="/dashboard/courses/new"
            className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            + New Course
          </Link>
        )}
        {profile?.role === 'student' && (
          <Link
            href="/dashboard/enroll"
            className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            + Enroll
          </Link>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-white font-medium mb-1">No courses yet</h3>
          <p className="text-slate-400 text-sm">
            {profile?.role === 'instructor'
              ? 'Create your first course to get started.'
              : 'Ask your instructor for a join code.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/dashboard/courses/${course.id}`}
              className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 hover:border-violet-500/50 hover:bg-slate-800 transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center">
                  <span className="text-xl">📚</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${course.is_active ? 'bg-green-500/20 text-green-400' : 'bg-slate-600/50 text-slate-400'}`}>
                  {course.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="text-white font-semibold group-hover:text-violet-300 transition">{course.title}</h3>
              <p className="text-slate-400 text-sm mt-1 line-clamp-2">{course.description ?? 'No description'}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
