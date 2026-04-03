import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = { title: 'Instructor Dashboard – NeuroClass' };

export default async function InstructorDashboardPage() {
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

  const { data: courses } = await supabase
    .from('courses')
    .select('id, name, code, term')
    .eq('instructor_id', user!.id);

  const { data: pendingGrades } = await supabase
    .from('grades')
    .select('id, projects(title, courses(name))')
    .eq('approval_status', 'PENDING_HITL')
    .limit(5);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Instructor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Courses</p>
          <p className="text-3xl font-bold mt-1">{courses?.length ?? 0}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Pending Approvals</p>
          <p className="text-3xl font-bold mt-1">{pendingGrades?.length ?? 0}</p>
        </div>
        <Link href="/dashboard/courses/new" className="border rounded-lg p-4 hover:border-primary transition-colors">
          <p className="text-sm text-muted-foreground">Quick Action</p>
          <p className="font-medium mt-1">+ Create Course</p>
        </Link>
      </div>

      {(pendingGrades?.length ?? 0) > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Pending Grade Approvals</h2>
          <div className="space-y-2">
            {pendingGrades?.map((g) => (
              <Link
                key={g.id}
                href={`/dashboard/instructor/approvals/${g.id}`}
                className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm">Grade review needed</span>
                <span className="text-xs text-muted-foreground">Review →</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
