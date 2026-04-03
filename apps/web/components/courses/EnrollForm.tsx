'use client'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function EnrollForm() {
  const supabase = createBrowserClient()
  const router = useRouter()
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleEnroll(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    const { data: course } = await supabase.from('courses').select('id').eq('join_code', joinCode.trim()).single()
    if (!course) { setError('Invalid join code'); setLoading(false); return }
    const { data: { user } } = await supabase.auth.getUser()
    const { error: err } = await supabase.from('enrollments').insert({ course_id: course.id, student_id: user!.id })
    if (err) { setError(err.message); setLoading(false); return }
    router.push(`/dashboard/courses/${course.id}`)
  }

  return (
    <form onSubmit={handleEnroll} className="flex gap-2">
      <input type="text" maxLength={8} value={joinCode} onChange={e => setJoinCode(e.target.value)}
        placeholder="Join code" required
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
      <button type="submit" disabled={loading}
        className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-60 transition-colors">
        {loading ? '…' : 'Enroll'}
      </button>
      {error && <p className="text-red-600 text-sm self-center">{error}</p>}
    </form>
  )
}
