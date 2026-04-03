'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase/client'

export function ForgotPasswordForm() {
  const supabase = createBrowserClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSent(true); setLoading(false)
  }

  if (sent) return (
    <div className="rounded-xl border border-nc-border bg-nc-surface p-6 text-center shadow-sm">
      <p className="text-sm text-nc-muted">Check your inbox at <strong>{email}</strong> for a reset link.</p>
      <Link href="/login" className="mt-4 inline-block text-sm text-nc-primary hover:underline">← Back to login</Link>
    </div>
  )

  return (
    <div className="rounded-xl border border-nc-border bg-nc-surface p-6 shadow-sm">
      {error && <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-nc-text mb-1">Email address</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full rounded-lg border border-nc-border bg-nc-surface-2 px-3 py-2 text-sm outline-none focus:border-nc-primary focus:ring-2 focus:ring-nc-primary/20 transition"
            placeholder="you@example.com" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-nc-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-nc-primary-hover disabled:opacity-50">
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-nc-primary hover:underline">← Back to login</Link>
      </div>
    </div>
  )
}
