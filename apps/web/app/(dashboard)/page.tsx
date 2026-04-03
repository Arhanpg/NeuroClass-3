import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function DashboardRootPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/onboarding')

  if (profile.role === 'INSTRUCTOR' || profile.role === 'ADMIN') {
    redirect('/instructor')
  }

  redirect('/courses')
}
