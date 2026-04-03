import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/login');

  // Role-based redirect
  if (profile.role === 'INSTRUCTOR' || profile.role === 'TEACHING_ASSISTANT') {
    redirect('/dashboard/courses');
  } else if (profile.role === 'ADMIN') {
    redirect('/dashboard/admin');
  } else {
    redirect('/dashboard/courses');
  }
}
