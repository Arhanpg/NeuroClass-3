'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function AuthGuard({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const supabase = createBrowserClient()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      if (allowedRoles) {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (!data || !allowedRoles.includes(data.role)) { router.push('/dashboard'); return }
      }
      setChecking(false)
    })
  }, [])

  if (checking) return <div className="flex items-center justify-center h-32 text-[var(--color-text-muted)]">Loading…</div>
  return <>{children}</>
}
