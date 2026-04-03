import { ProjectForm } from '@/components/projects/ProjectForm';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = { title: 'New Project – NeuroClass' };

export default async function NewProjectPage({
  params,
}: {
  params: { courseId: string };
}) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single();

  if (profile?.role !== 'INSTRUCTOR') redirect(`/dashboard/courses/${params.courseId}/projects`);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Create New Project</h1>
      <ProjectForm courseId={params.courseId} />
    </div>
  );
}
