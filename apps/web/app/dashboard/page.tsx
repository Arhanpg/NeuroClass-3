import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  // Role-based redirect
  if (profile?.role === 'INSTRUCTOR' || profile?.role === 'TEACHING_ASSISTANT') {
    redirect('/dashboard/instructor')
  }

  if (profile?.role === 'ADMIN') {
    redirect('/dashboard/admin')
  }

  // Default: student view
  redirect('/dashboard/courses')
}
