'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Props {
  children: React.ReactNode
  requiredRole?: 'INSTRUCTOR' | 'STUDENT' | 'ADMIN' | 'TEACHING_ASSISTANT'
}

export function AuthGuard({ children, requiredRole }: Props) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace('/login')
        return
      }

      if (requiredRole) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role !== requiredRole) {
          router.replace('/dashboard')
          return
        }
      }

      setUser(user)
      setLoading(false)
    })
  }, [router, requiredRole])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Verifying session…</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
