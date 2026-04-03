import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/nav'
import { SupabaseProvider } from '@/components/providers/supabase-provider'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  return (
    <SupabaseProvider initialSession={session}>
      <div className="flex min-h-screen bg-nc-bg">
        <DashboardNav />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </SupabaseProvider>
  )
}
