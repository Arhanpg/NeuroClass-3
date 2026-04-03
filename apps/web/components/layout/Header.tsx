'use client'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function Header({ profile }: { profile: any }) {
  const supabase = createBrowserClient()
  const router = useRouter()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-[var(--color-surface)] border-b border-gray-200 flex-shrink-0">
      <div />
      <div className="flex items-center gap-3">
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt={profile.full_name} width={32} height={32}
            className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
            {profile?.full_name?.[0]?.toUpperCase() ?? '?'}
          </div>
        )}
        <span className="text-sm font-medium text-[var(--color-text)] hidden sm:block">{profile?.full_name}</span>
        <button onClick={signOut}
          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
          Sign out
        </button>
      </div>
    </header>
  )
}
