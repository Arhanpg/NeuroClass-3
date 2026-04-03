import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Analytics – NeuroClass' };

export default async function AnalyticsPage() {
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Avg Grade', 'Active Students', 'Tutor Sessions'].map((metric) => (
          <div key={metric} className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">{metric}</p>
            <div className="h-8 mt-2 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
      <div className="border rounded-lg p-6 bg-muted/30">
        <p className="text-sm text-muted-foreground">Class analytics charts — Phase 4 (ClassHeatmap, GradeDistribution)</p>
      </div>
    </div>
  );
}
