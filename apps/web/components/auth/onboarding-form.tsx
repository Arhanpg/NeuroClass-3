'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'

export function OnboardingForm() {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [form, setForm] = useState({ full_name: '', role: 'student', bio: '', institution: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: form.full_name, role: form.role, bio: form.bio, institution: form.institution })
      .eq('id', user.id)
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="rounded-xl border border-nc-border bg-nc-surface p-6 shadow-sm">
      {error && <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-nc-text mb-1">Full name *</label>
          <input name="full_name" type="text" required value={form.full_name} onChange={handleChange}
            className="w-full rounded-lg border border-nc-border bg-nc-surface-2 px-3 py-2 text-sm outline-none focus:border-nc-primary focus:ring-2 focus:ring-nc-primary/20 transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-nc-text mb-1">I am a… *</label>
          <select name="role" value={form.role} onChange={handleChange}
            className="w-full rounded-lg border border-nc-border bg-nc-surface-2 px-3 py-2 text-sm outline-none focus:border-nc-primary transition">
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-nc-text mb-1">Institution</label>
          <input name="institution" type="text" value={form.institution} onChange={handleChange}
            className="w-full rounded-lg border border-nc-border bg-nc-surface-2 px-3 py-2 text-sm outline-none focus:border-nc-primary transition"
            placeholder="e.g. IIIT Dharwad" />
        </div>
        <div>
          <label className="block text-sm font-medium text-nc-text mb-1">Bio</label>
          <textarea name="bio" rows={3} value={form.bio} onChange={handleChange}
            className="w-full rounded-lg border border-nc-border bg-nc-surface-2 px-3 py-2 text-sm outline-none focus:border-nc-primary transition resize-none"
            placeholder="Tell us about yourself (optional)" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-nc-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-nc-primary-hover disabled:opacity-50">
          {loading ? 'Saving…' : 'Complete setup'}
        </button>
      </form>
    </div>
  )
}
