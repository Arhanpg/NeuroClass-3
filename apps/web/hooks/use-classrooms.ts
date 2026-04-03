import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useProfile } from './use-profile'

export function useClassrooms() {
  const { user } = useSupabase()
  const { profile } = useProfile()
  const supabase = createBrowserClient()
  const [classrooms, setClassrooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !profile) return

    const fetchClassrooms = async () => {
      if (profile.role === 'instructor') {
        const { data } = await supabase
          .from('classrooms')
          .select('*')
          .eq('instructor_id', user.id)
          .order('created_at', { ascending: false })
        setClassrooms(data ?? [])
      } else {
        const { data } = await supabase
          .from('enrollments')
          .select('classroom:classrooms(*)')
          .eq('student_id', user.id)
          .eq('status', 'active')
        setClassrooms((data ?? []).map((e: any) => e.classroom).filter(Boolean))
      }
      setLoading(false)
    }

    fetchClassrooms()
  }, [user, profile, supabase])

  return { classrooms, loading }
}
