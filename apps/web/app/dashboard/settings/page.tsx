'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'

export default function SettingsPage() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (profile) setFullName(profile.full_name)
  }, [profile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    setError('')
    setSaved(false)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', profile.id)
    setSaving(false)
    if (error) {
      setError(error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      {/* Profile section */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Profile</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <p className="text-sm text-muted-foreground h-10 flex items-center px-3 bg-muted rounded-lg">
              {profile?.email}
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Role</label>
            <p className="text-sm h-10 flex items-center px-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {profile?.role}
              </span>
            </p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {saved && <p className="text-sm text-green-600">Changes saved!</p>}
          <button
            type="submit"
            disabled={saving}
            className="h-10 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </section>

      {/* Danger zone */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Account</h2>
        <p className="text-sm text-muted-foreground">To change your password, use the link below.</p>
        <button
          type="button"
          onClick={async () => {
            const supabaseClient = createClient()
            if (profile?.email) {
              await supabaseClient.auth.resetPasswordForEmail(profile.email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
              })
              alert('Password reset email sent!')
            }
          }}
          className="text-sm text-primary hover:underline"
        >
          Send password reset email
        </button>
      </section>
    </div>
  )
}
