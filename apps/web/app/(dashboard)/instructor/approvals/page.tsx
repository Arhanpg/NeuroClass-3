import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = { title: 'Grade Approvals – NeuroClass' };

export default async function ApprovalsPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single();

  if (profile?.role !== 'INSTRUCTOR' && profile?.role !== 'TEACHING_ASSISTANT') {
    redirect('/dashboard');
  }

  const { data: pendingGrades } = await supabase
    .from('grades')
    .select('*, projects(title, course_id, courses(name)), teams(name)')
    .eq('approval_status', 'PENDING_HITL')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pending Grade Approvals</h1>

      {!pendingGrades || pendingGrades.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>All caught up! No pending approvals.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingGrades.map((grade) => (
            <div key={grade.id} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{(grade.projects as Record<string, unknown>)?.title as string}</p>
                <p className="text-sm text-muted-foreground">Team: {(grade.teams as Record<string, unknown>)?.name as string}</p>
              </div>
              <Link
                href={`/dashboard/instructor/approvals/${grade.id}`}
                className="text-sm text-primary hover:underline"
              >
                Review →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
