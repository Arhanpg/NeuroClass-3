'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'

export interface Course {
  id: string
  name: string
  code: string
  term: string
  description: string | null
  instructor_id: string
  join_code: string
  pedagogy_style: string
  is_active: boolean
  created_at: string
}

export function useCourses() {
  const { user, profile } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCourses = useCallback(async () => {
    if (!user || !profile) return
    setLoading(true)
    const supabase = createClient()

    let query = supabase.from('courses').select('*')

    if (profile.role === 'STUDENT') {
      // Get enrolled courses via join
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('student_id', user.id)
      const ids = enrollments?.map((e) => e.course_id) ?? []
      if (ids.length === 0) {
        setCourses([])
        setLoading(false)
        return
      }
      query = query.in('id', ids)
    } else {
      query = query.eq('instructor_id', user.id)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setCourses(data ?? [])
    setLoading(false)
  }, [user, profile])

  useEffect(() => { fetchCourses() }, [fetchCourses])

  const enrollByCode = async (joinCode: string) => {
    if (!user) return { error: 'Not authenticated' }
    const supabase = createClient()
    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('join_code', joinCode.toUpperCase())
      .single()
    if (!course) return { error: 'Invalid join code' }
    const { error } = await supabase.from('enrollments').insert({ course_id: course.id, student_id: user.id })
    if (!error) fetchCourses()
    return { error: error?.message }
  }

  return { courses, loading, error, refetch: fetchCourses, enrollByCode }
}
