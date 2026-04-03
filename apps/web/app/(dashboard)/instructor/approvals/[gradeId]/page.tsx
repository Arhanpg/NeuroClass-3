import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Review Grade – NeuroClass' };

export default async function GradeReviewPage({
  params,
}: {
  params: { gradeId: string };
}) {
  const supabase = createServerSupabaseClient();

  const { data: grade } = await supabase
    .from('grades')
    .select('*, projects(title), teams(name), rubrics(schema)')
    .eq('id', params.gradeId)
    .single();

  if (!grade) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Grade Review</h1>
        <p className="text-muted-foreground">
          {(grade.projects as Record<string, unknown>)?.title as string} · {(grade.teams as Record<string, unknown>)?.name as string}
        </p>
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold">Preliminary AI Scores</h2>
        <pre className="text-xs bg-muted p-4 rounded overflow-auto">
          {JSON.stringify(grade.preliminary_scores, null, 2)}
        </pre>
      </div>

      <div className="border rounded-lg p-6 bg-muted/50">
        <p className="text-sm text-muted-foreground">Full HiTL review interface — Phase 4 (GradeReviewPanel component)</p>
      </div>
    </div>
  );
}
