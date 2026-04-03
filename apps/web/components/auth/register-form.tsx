'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase/client'

export function RegisterForm() {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'student' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name, role: form.role },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <div className="rounded-xl border border-nc-border bg-nc-surface p-6 text-center shadow-sm">
      <div className="mb-3 text-3xl">&#x2709;&#xfe0f;</div>
      <h2 className="text-lg font-semibold text-nc-text">Check your email</h2>
      <p className="mt-1 text-sm text-nc-muted">We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account.</p>
    </div>
  )

  return (
    <div className="rounded-xl border border-nc-border bg-nc-surface p-6 shadow-sm">
      {error && <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-nc-text mb-1">Full name</label>
          <input name="full_name" type="text" required value={form.full_name} onChange={handleChange}
            className="w-full rounded-lg border border-nc-border bg-nc-surface-2 px-3 py-2 text-sm outline-none focus:border-nc-primary focus:ring-2 focus:ring-nc-primary/20 transition" placeholder="Ada Lovelace" />
        </div>
        <div>
          <label className="block text-sm font-medium text-nc-text mb-1">Email</label>
          <input name="email" type="email" required value={form.email} onChange={handleChange}
            className="w-full rounded-lg border border-nc-border bg-nc-surface-2 px-3 py-2 text-sm outline-none focus:border-nc-primary focus:ring-2 focus:ring-nc-primary/20 transition" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-nc-text mb-1">I am a…</label>
          <select name="role" value={form.role} onChange={handleChange}
            className="w-full rounded-lg border border-nc-border bg-nc-surface-2 px-3 py-2 text-sm outline-none focus:border-nc-primary transition">
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-nc-text mb-1">Password</label>
          <input name="password" type="password" required minLength={8} value={form.password} onChange={handleChange}
            className="w-full rounded-lg border border-nc-border bg-nc-surface-2 px-3 py-2 text-sm outline-none focus:border-nc-primary focus:ring-2 focus:ring-nc-primary/20 transition" placeholder="Min. 8 characters" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-nc-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-nc-primary-hover disabled:opacity-50">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-nc-muted">
        Already have an account? <Link href="/login" className="text-nc-primary hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  )
}
