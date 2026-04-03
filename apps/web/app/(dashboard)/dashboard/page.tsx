import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/onboarding')

  // Role-based redirect
  if (profile.role === 'instructor') {
    redirect('/dashboard/instructor')
  } else if (profile.role === 'admin') {
    redirect('/dashboard/admin')
  } else {
    redirect('/dashboard/courses')
  }
}
