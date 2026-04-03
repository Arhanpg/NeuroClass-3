'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ThemeToggle } from './ThemeToggle'
import { NotificationBell } from '@/components/notifications/NotificationBell'

export function Header() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-slate-800 border-b border-slate-700 flex-shrink-0">
      <div className="flex items-center gap-2">
        {/* Breadcrumbs slot */}
        <span className="text-slate-400 text-sm" id="page-title" />
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
        <ThemeToggle />
        <button
          onClick={handleSignOut}
          className="text-slate-400 hover:text-white text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-700"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
