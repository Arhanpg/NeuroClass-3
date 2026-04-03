'use client'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { PEDAGOGY_STYLES } from '@/lib/constants'

export default function NewCoursePage() {
  const supabase = createBrowserClient()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', code: '', term: '', pedagogy_style: 'DIRECT_INSTRUCTION', enrollment_cap: '200' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('courses').insert({
      ...form,
      enrollment_cap: Number(form.enrollment_cap),
      instructor_id: user!.id,
    }).select().single()
    if (error) { setError(error.message); setLoading(false); return }
    router.push(`/dashboard/courses/${data.id}`)
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-6">Create New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-[var(--color-surface)] p-6 rounded-xl border border-gray-200">
        {(['name', 'code', 'term'] as const).map(field => (
          <div key={field}>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1 capitalize">{field}</label>
            <input type="text" required value={form[field]} onChange={set(field)}
              placeholder={field === 'code' ? 'CS-401' : field === 'term' ? 'Spring 2026' : ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Pedagogy Style</label>
          <select value={form.pedagogy_style} onChange={set('pedagogy_style')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
            {PEDAGOGY_STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Enrollment Cap</label>
          <input type="number" min="1" max="500" value={form.enrollment_cap} onChange={set('enrollment_cap')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-2 px-4 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-60 transition-colors">
          {loading ? 'Creating…' : 'Create Course'}
        </button>
      </form>
    </div>
  )
}
