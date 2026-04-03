import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export const metadata = { title: 'AI Tutor – NeuroClass' };

export default async function TutorPage({
  params,
}: {
  params: { courseId: string };
}) {
  const supabase = createServerSupabaseClient();
  const { data: course } = await supabase
    .from('courses')
    .select('id, name')
    .eq('id', params.courseId)
    .single();

  if (!course) notFound();

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">AI Tutor</h1>
        <p className="text-muted-foreground">{course.name}</p>
      </div>
      {/* TutorChat component goes here — Phase 3 */}
      <div className="flex-1 flex items-center justify-center border rounded-lg bg-muted/20">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">AI Tutor</p>
          <p className="text-sm mt-1">Ask anything about your course material</p>
          <p className="text-xs mt-3 text-muted-foreground/60">Powered by LangGraph · Phase 3</p>
        </div>
      </div>
    </div>
  );
}
