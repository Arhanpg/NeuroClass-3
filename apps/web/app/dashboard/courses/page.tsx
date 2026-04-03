import { createServerClient } from '@/lib/supabase/server'
import { CourseCard } from '@/components/courses/CourseCard'

export const metadata = { title: 'Courses' }

export default async function CoursesPage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Get enrolled or owned courses
  const { data: courses } = await supabase
    .from('courses')
    .select('*, profiles!instructor_id(full_name, avatar_url)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[var(--color-text)]">Courses</h1>
        <a href="/dashboard/courses/new"
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
          + New Course
        </a>
      </div>
      {!courses?.length ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          <p className="text-lg font-medium mb-2">No courses yet</p>
          <p className="text-sm">Enroll in a course or create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
