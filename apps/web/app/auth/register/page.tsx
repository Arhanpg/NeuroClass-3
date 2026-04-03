'use client'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const ROLES = ['STUDENT', 'INSTRUCTOR', 'TEACHING_ASSISTANT'] as const

export default function RegisterPage() {
  const supabase = createBrowserClient()
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'STUDENT' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name, role: form.role } },
    })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="w-full max-w-md p-8 bg-[var(--color-surface)] rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Create Account</h1>
        <p className="text-[var(--color-text-muted)] mb-6">Join NeuroClass today</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(['full_name', 'email', 'password'] as const).map(field => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-[var(--color-text)] mb-1 capitalize">
                {field.replace('_', ' ')}
              </label>
              <input id={field} type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                required value={form[field]} onChange={set(field)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            </div>
          ))}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-[var(--color-text)] mb-1">Role</label>
            <select id="role" value={form.role} onChange={set('role')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
              {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-2 px-4 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-60 transition-colors">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Already have an account?{' '}
          <a href="/auth/login" className="text-[var(--color-primary)] hover:underline">Sign in</a>
        </p>
      </div>
    </main>
  )
}
