import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CourseForm } from '@/components/courses/CourseForm';

export default async function NewCoursePage() {
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

  if (profile?.role !== 'INSTRUCTOR') redirect('/dashboard/courses');

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Course</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Fill in the details below. A unique join code will be auto-generated.
        </p>
      </div>
      <CourseForm />
    </div>
  );
}
