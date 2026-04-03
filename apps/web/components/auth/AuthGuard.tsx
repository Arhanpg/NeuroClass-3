import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type Role = 'student' | 'instructor' | 'admin'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: Role | Role[]
}

/**
 * Server Component auth guard.
 * Use in layout.tsx files to protect entire route groups.
 */
export async function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  if (requiredRole) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!profile || !allowed.includes(profile.role as Role)) {
      redirect('/dashboard')
    }
  }

  return <>{children}</>
}
