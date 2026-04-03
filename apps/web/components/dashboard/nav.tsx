'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard',    label: 'Home',        icon: '🏠' },
  { href: '/classrooms',   label: 'Classrooms',  icon: '🏫' },
  { href: '/assignments',  label: 'Assignments', icon: '📝' },
  { href: '/profile',      label: 'Profile',     icon: '👤' },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { signOut } = useSupabase()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-nc-border bg-nc-surface min-h-screen">
      <div className="px-4 py-5 border-b border-nc-border">
        <span className="text-lg font-bold text-nc-primary tracking-tight">NeuroClass</span>
      </div>
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              pathname === item.href
                ? 'bg-nc-primary/10 text-nc-primary'
                : 'text-nc-muted hover:bg-nc-surface-offset hover:text-nc-text'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-2 border-t border-nc-border">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-nc-muted hover:bg-nc-surface-offset hover:text-nc-text transition"
        >
          <span>🚪</span> Sign out
        </button>
      </div>
    </aside>
  )
}
