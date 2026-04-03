import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  const supabase = createServerSupabaseClient();
  const { data: course } = await supabase
    .from('courses')
    .select('*, profiles!instructor_id(full_name)')
    .eq('id', params.courseId)
    .single();

  if (!course) notFound();

  const { data: lectures } = await supabase
    .from('lectures')
    .select('*')
    .eq('course_id', params.courseId)
    .order('uploaded_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link href="/dashboard/courses" className="hover:underline">Courses</Link>
          <span>/</span>
          <span>{course.name}</span>
        </div>
        <h1 className="text-2xl font-bold">{course.name}</h1>
        <p className="text-muted-foreground">{course.code} · {course.term}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href={`/dashboard/courses/${params.courseId}/tutor`}
          className="p-4 border rounded-lg hover:border-primary transition-colors">
          <h3 className="font-semibold">AI Tutor</h3>
          <p className="text-sm text-muted-foreground mt-1">Ask questions about course material</p>
        </Link>
        <Link href={`/dashboard/courses/${params.courseId}/lectures`}
          className="p-4 border rounded-lg hover:border-primary transition-colors">
          <h3 className="font-semibold">Lectures</h3>
          <p className="text-sm text-muted-foreground mt-1">{lectures?.length ?? 0} uploaded</p>
        </Link>
        <Link href={`/dashboard/courses/${params.courseId}/projects`}
          className="p-4 border rounded-lg hover:border-primary transition-colors">
          <h3 className="font-semibold">Projects</h3>
          <p className="text-sm text-muted-foreground mt-1">Team projects &amp; grading</p>
        </Link>
      </div>
    </div>
  );
}
