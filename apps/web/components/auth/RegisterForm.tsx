'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function RegisterForm() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-3">✉️</div>
        <h3 className="text-white font-medium mb-1">Check your email</h3>
        <p className="text-slate-400 text-sm">
          We sent a confirmation link to <strong className="text-slate-300">{email}</strong>.
          Click it to activate your account.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="reg-email" className="block text-sm text-slate-300 mb-1.5">Email</label>
        <input
          id="reg-email" type="email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
          required autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="reg-password" className="block text-sm text-slate-300 mb-1.5">Password</label>
        <input
          id="reg-password" type="password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
          required minLength={8} autoComplete="new-password"
        />
      </div>
      <div>
        <label htmlFor="reg-confirm" className="block text-sm text-slate-300 mb-1.5">Confirm password</label>
        <input
          id="reg-confirm" type="password" value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat password"
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
          required autoComplete="new-password"
        />
      </div>
      <button
        type="submit" disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg py-3 font-medium transition"
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  )
}
