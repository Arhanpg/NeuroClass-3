import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useSupabase } from '@/components/providers/supabase-provider'
import type { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

export function useProfile() {
  const { user } = useSupabase()
  const supabase = createBrowserClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setProfile(data)
        setLoading(false)
      })
  }, [user, supabase])

  return { profile, loading }
}
