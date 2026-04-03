'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type Course = Database['public']['Tables']['courses']['Row']

export function useCourses(role: 'student' | 'instructor', userId: string) {
  const supabase = createClient()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true)
      try {
        if (role === 'instructor') {
          const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('instructor_id', userId)
            .order('created_at', { ascending: false })
          if (error) throw error
          setCourses(data ?? [])
        } else {
          const { data, error } = await supabase
            .from('enrollments')
            .select('course:courses(*)')
            .eq('student_id', userId)
          if (error) throw error
          setCourses((data ?? []).map((e) => e.course as Course).filter(Boolean))
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fetch courses')
      } finally {
        setLoading(false)
      }
    }

    if (userId) fetchCourses()
  }, [supabase, role, userId])

  return { courses, loading, error }
}
