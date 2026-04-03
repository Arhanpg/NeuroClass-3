import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CourseCard } from '@/components/courses/CourseCard';
import Link from 'next/link';

export const metadata = { title: 'Courses – NeuroClass' };

export default async function CoursesPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single();

  let courses: Record<string, unknown>[] = [];

  if (profile?.role === 'INSTRUCTOR' || profile?.role === 'TEACHING_ASSISTANT') {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('instructor_id', user!.id)
      .order('created_at', { ascending: false });
    courses = data ?? [];
  } else {
    const { data } = await supabase
      .from('enrollments')
      .select('course:courses(*)')
      .eq('student_id', user!.id)
      .order('joined_at', { ascending: false });
    courses = (data ?? []).map((e) => e.course as Record<string, unknown>);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="text-muted-foreground">
            {profile?.role === 'INSTRUCTOR' ? 'Courses you teach' : 'Your enrolled courses'}
          </p>
        </div>
        {profile?.role === 'INSTRUCTOR' && (
          <Link
            href="/dashboard/courses/new"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            + New Course
          </Link>
        )}
        {profile?.role === 'STUDENT' && (
          <Link
            href="/dashboard/enroll"
            className="inline-flex items-center px-4 py-2 border border-input rounded-md text-sm font-medium hover:bg-accent transition-colors"
          >
            Enroll in Course
          </Link>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No courses yet.</p>
          {profile?.role === 'INSTRUCTOR' && (
            <Link href="/dashboard/courses/new" className="mt-4 inline-block text-primary underline">
              Create your first course
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id as string} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
