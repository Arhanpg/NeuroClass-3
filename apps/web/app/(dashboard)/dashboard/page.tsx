import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Dashboard — NeuroClass' }

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-nc-text">
          Welcome back, {profile?.full_name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="mt-1 text-sm text-nc-muted capitalize">{profile?.role} dashboard</p>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {['Classrooms', 'Assignments Due', 'Submissions', 'AI Sessions'].map((label, i) => (
          <div key={label} className="rounded-xl border border-nc-border bg-nc-surface p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-nc-muted">{label}</p>
            <p className="mt-2 text-2xl font-bold text-nc-text tabular-nums">—</p>
          </div>
        ))}
      </div>

      {/* Classrooms grid placeholder */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-nc-text">Your Classrooms</h2>
        </div>
        <div className="rounded-xl border border-nc-border bg-nc-surface p-12 text-center">
          <p className="text-nc-muted text-sm">No classrooms yet. Create or join one to get started.</p>
        </div>
      </section>
    </div>
  )
}
