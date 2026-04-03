import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CourseCard } from '@/components/courses/CourseCard';
import type { Database } from '@/lib/supabase/types';

type Course = Database['public']['Tables']['courses']['Row'];

export default async function CoursesPage() {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role ?? 'STUDENT';
  let courses: Course[] = [];

  if (role === 'INSTRUCTOR' || role === 'ADMIN' || role === 'TEACHING_ASSISTANT') {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('instructor_id', user.id)
      .order('created_at', { ascending: false });
    courses = data ?? [];
  } else {
    const { data } = await supabase
      .from('enrollments')
      .select('courses(*)')
      .eq('student_id', user.id)
      .order('joined_at', { ascending: false });
    courses = (data ?? []).map((e: any) => e.courses).filter(Boolean) as Course[];
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {role === 'STUDENT' ? 'Your enrolled courses' : 'Courses you manage'}
          </p>
        </div>
        <div className="flex gap-3">
          {role === 'STUDENT' && (
            <Link
              href="/dashboard/enroll"
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              + Enroll
            </Link>
          )}
          {(role === 'INSTRUCTOR') && (
            <Link
              href="/dashboard/courses/new"
              className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              + New Course
            </Link>
          )}
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No courses yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {role === 'STUDENT'
              ? 'Ask your instructor for a join code to enroll.'
              : 'Create your first course to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} role={role} />
          ))}
        </div>
      )}
    </div>
  );
}
