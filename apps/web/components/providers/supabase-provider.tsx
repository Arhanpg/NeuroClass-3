'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { createBrowserClient } from '@/lib/supabase/client'

type SupabaseContextValue = {
  session: Session | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextValue>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
})

export function SupabaseProvider({ children, initialSession }: {
  children: React.ReactNode
  initialSession: Session | null
}) {
  const supabase = createBrowserClient()
  const [session, setSession] = useState<Session | null>(initialSession)
  const [loading, setLoading] = useState(!initialSession)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [supabase])

  return (
    <SupabaseContext.Provider value={{ session, user: session?.user ?? null, loading, signOut }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => useContext(SupabaseContext)
