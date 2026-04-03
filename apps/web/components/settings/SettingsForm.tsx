'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  role: string
}

export function SettingsForm({ profile }: { profile: Profile | null }) {
  const router = useRouter()
  const supabase = createClient()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', profile?.id)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {success && (
            <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
              Profile updated successfully!
            </p>
          )}
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{error}</p>
          )}
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              value={profile?.email ?? ''}
              disabled
              className="w-full bg-slate-700/30 border border-slate-700 rounded-lg px-4 py-3 text-slate-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Role</label>
            <input
              type="text"
              value={profile?.role ?? ''}
              disabled
              className="w-full bg-slate-700/30 border border-slate-700 rounded-lg px-4 py-3 text-slate-400 capitalize cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
          >
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
