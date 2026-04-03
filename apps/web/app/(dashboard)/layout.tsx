import { redirect } from 'next/navigation'
import { createServerClient as createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBar } from '@/components/dashboard/TopBar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, role, avatar_url')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  return (
    <div className="min-h-screen bg-[#f7f6f2] flex">
      <Sidebar role={profile.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          fullName={profile.full_name}
          role={profile.role}
          avatarUrl={profile.avatar_url}
        />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
