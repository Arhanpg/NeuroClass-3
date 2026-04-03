'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function RegisterForm() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'STUDENT' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name, role: form.role },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/onboarding')
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-slate-300 mb-1.5">
          Full name
        </label>
        <input
          id="full_name" type="text" required autoComplete="name"
          value={form.full_name} onChange={set('full_name')}
          className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          placeholder="Arhan Ghosarwade"
        />
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-slate-300 mb-1.5">
          Email address
        </label>
        <input
          id="reg-email" type="email" required autoComplete="email"
          value={form.email} onChange={set('email')}
          className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          placeholder="you@university.edu"
        />
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-sm font-medium text-slate-300 mb-1.5">
          Password
        </label>
        <input
          id="reg-password" type="password" required autoComplete="new-password" minLength={8}
          value={form.password} onChange={set('password')}
          className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          placeholder="Min. 8 characters"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1.5">
          I am a…
        </label>
        <select
          id="role" value={form.role} onChange={set('role')}
          className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        >
          <option value="STUDENT">Student</option>
          <option value="INSTRUCTOR">Instructor</option>
          <option value="TEACHING_ASSISTANT">Teaching Assistant</option>
        </select>
      </div>

      <button
        type="submit" disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
