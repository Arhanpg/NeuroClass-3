'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'

export default function EnrollPage() {
  const supabase = createClient()
  const router = useRouter()
  const { user } = useAuth()
  const [joinCode, setJoinCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError('')
    setLoading(true)

    try {
      // Look up course by join code
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('id, name')
        .eq('join_code', joinCode.trim().toUpperCase())
        .eq('is_archived', false)
        .single()

      if (courseError || !course) throw new Error('Invalid join code. Please check and try again.')

      // Enroll student
      const { error: enrollError } = await supabase
        .from('enrollments')
        .insert({ course_id: course.id, student_id: user.id })

      if (enrollError) {
        if (enrollError.code === '23505') throw new Error('You are already enrolled in this course.')
        throw enrollError
      }

      router.push(`/dashboard/courses/${course.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Enrollment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Enroll in a Course</h1>
        <p className="text-sm text-muted-foreground mt-1">Enter the join code provided by your instructor</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <form onSubmit={handleEnroll} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="joinCode" className="text-sm font-medium">Join Code</label>
            <input
              id="joinCode"
              type="text"
              required
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g. A1B2C3D4"
              maxLength={8}
              className="w-full h-12 px-4 rounded-lg border border-input bg-background text-lg font-mono tracking-widest text-center uppercase focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || joinCode.length < 6}
            className="w-full h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {loading ? 'Enrolling...' : 'Enroll'}
          </button>
        </form>
      </div>
    </div>
  )
}
