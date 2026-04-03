import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Grades – NeuroClass' };

export default async function GradesPage({
  params,
}: {
  params: { courseId: string };
}) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: course } = await supabase
    .from('courses')
    .select('id, name')
    .eq('id', params.courseId)
    .single();

  if (!course) notFound();

  const { data: grades } = await supabase
    .from('released_grades')
    .select('*, projects(title)')
    .eq('student_id', user!.id)
    .order('released_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Grades</h1>
        <p className="text-muted-foreground">{course.name}</p>
      </div>

      {!grades || grades.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No grades released yet.</div>
      ) : (
        <div className="space-y-3">
          {grades.map((g) => (
            <div key={g.id} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{(g.projects as Record<string, unknown>)?.title as string}</p>
                <p className="text-sm text-muted-foreground">{g.feedback_summary}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{g.letter_grade}</p>
                <p className="text-sm text-muted-foreground">{g.normalized_score?.toFixed(1)}/100</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
