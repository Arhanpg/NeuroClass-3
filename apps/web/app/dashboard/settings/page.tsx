'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const supabase = createBrowserClient()
  const [profile, setProfile] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => setProfile(data))
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await supabase.from('profiles').update({ full_name: profile.full_name, avatar_url: profile.avatar_url }).eq('id', profile.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!profile) return <div className="text-[var(--color-text-muted)] p-6">Loading…</div>

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-6">Settings</h1>
      <form onSubmit={handleSave} className="space-y-4 bg-[var(--color-surface)] p-6 rounded-xl border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Full Name</label>
          <input type="text" value={profile.full_name ?? ''} onChange={e => setProfile((p: any) => ({ ...p, full_name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Email</label>
          <input type="email" value={profile.email} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Role</label>
          <input type="text" value={profile.role} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400" />
        </div>
        <button type="submit" disabled={saving}
          className="w-full py-2 px-4 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-60 transition-colors">
          {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
