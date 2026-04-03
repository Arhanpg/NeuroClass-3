import { CourseForm } from '@/components/courses/CourseForm';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = { title: 'New Course – NeuroClass' };

export default async function NewCoursePage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single();

  if (profile?.role !== 'INSTRUCTOR') redirect('/dashboard/courses');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create New Course</h1>
        <p className="text-muted-foreground">Set up a new course for your students</p>
      </div>
      <CourseForm />
    </div>
  );
}
