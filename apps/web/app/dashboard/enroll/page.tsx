'use client'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function EnrollPage() {
  const supabase = createBrowserClient()
  const router = useRouter()
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleEnroll(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data: course } = await supabase.from('courses').select('id').eq('join_code', joinCode.trim()).single()
    if (!course) { setError('Invalid join code. Please check and try again.'); setLoading(false); return }
    const { data: { user } } = await supabase.auth.getUser()
    const { error: enrollError } = await supabase.from('enrollments').insert({ course_id: course.id, student_id: user!.id })
    if (enrollError) { setError(enrollError.message); setLoading(false); return }
    router.push(`/dashboard/courses/${course.id}`)
  }

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-2">Enroll in a Course</h1>
      <p className="text-[var(--color-text-muted)] text-sm mb-6">Enter the join code provided by your instructor.</p>
      <form onSubmit={handleEnroll} className="space-y-4 bg-[var(--color-surface)] p-6 rounded-xl border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Join Code</label>
          <input type="text" required value={joinCode} onChange={e => setJoinCode(e.target.value)}
            placeholder="e.g. ab12cd34" maxLength={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-2 px-4 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-60 transition-colors">
          {loading ? 'Enrolling…' : 'Enroll'}
        </button>
      </form>
    </div>
  )
}
