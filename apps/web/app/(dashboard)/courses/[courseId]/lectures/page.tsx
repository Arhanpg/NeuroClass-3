import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { LectureCard } from '@/components/lectures/LectureCard';
import Link from 'next/link';

export const metadata = { title: 'Lectures – NeuroClass' };

export default async function LecturesPage({
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

  const { data: lectures } = await supabase
    .from('lectures')
    .select('*')
    .eq('course_id', params.courseId)
    .order('uploaded_at', { ascending: false });

  const isInstructor = profile?.role === 'INSTRUCTOR' && course.instructor_id === user!.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lectures</h1>
          <p className="text-muted-foreground">{course.name}</p>
        </div>
        {isInstructor && (
          <Link
            href={`/dashboard/courses/${params.courseId}/lectures/upload`}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Upload Lecture
          </Link>
        )}
      </div>

      {!lectures || lectures.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No lectures uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lectures.map((lecture) => (
            <LectureCard key={lecture.id} lecture={lecture} />
          ))}
        </div>
      )}
    </div>
  );
}
