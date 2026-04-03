import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProjectCard } from '@/components/projects/ProjectCard';
import Link from 'next/link';

export const metadata = { title: 'Projects – NeuroClass' };

export default async function ProjectsPage({
  params,
}: {
  params: { courseId: string };
}) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: course } = await supabase
    .from('courses')
    .select('id, name, instructor_id')
    .eq('id', params.courseId)
    .single();

  if (!course) notFound();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single();

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('course_id', params.courseId)
    .order('created_at', { ascending: false });

  const isInstructor = profile?.role === 'INSTRUCTOR';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">{course.name}</p>
        </div>
        {isInstructor && (
          <Link
            href={`/dashboard/courses/${params.courseId}/projects/new`}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            + New Project
          </Link>
        )}
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No projects yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
