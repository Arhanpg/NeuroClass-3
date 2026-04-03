import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Profile — NeuroClass' }

export default async function ProfilePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-nc-text mb-6">Profile</h1>
      <div className="rounded-xl border border-nc-border bg-nc-surface p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-nc-primary/10 flex items-center justify-center text-nc-primary text-2xl font-bold">
            {profile?.full_name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="font-semibold text-nc-text">{profile?.full_name}</p>
            <p className="text-sm text-nc-muted">{user.email}</p>
            <span className="inline-block mt-1 rounded-full bg-nc-primary/10 px-2 py-0.5 text-xs font-medium text-nc-primary capitalize">{profile?.role}</span>
          </div>
        </div>
        <dl className="divide-y divide-nc-border">
          {[
            ['Institution', profile?.institution || '—'],
            ['Bio', profile?.bio || '—'],
            ['Member since', new Date(profile?.created_at ?? '').toLocaleDateString()],
          ].map(([label, value]) => (
            <div key={label as string} className="py-3 flex justify-between text-sm">
              <dt className="text-nc-muted">{label}</dt>
              <dd className="text-nc-text text-right max-w-xs">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
