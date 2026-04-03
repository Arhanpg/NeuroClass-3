import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'ADMIN') redirect('/dashboard')

  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: courseCount } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Platform management</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Users', value: userCount ?? 0 },
          { label: 'Total Courses', value: courseCount ?? 0 },
          { label: 'Platform Status', value: 'Healthy' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* User management table — full CRUD in Phase 2 */}
      <section className="bg-card border border-border rounded-xl p-4">
        <p className="text-sm text-muted-foreground">Full user management, role assignment, and platform analytics are wired in Phase 2.</p>
      </section>
    </div>
  )
}
