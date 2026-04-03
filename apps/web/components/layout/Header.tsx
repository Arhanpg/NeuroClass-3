'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  full_name: string | null
  email: string
  avatar_url: string | null
  role: string
}

export function Header({ user }: { user: Profile }) {
  const router = useRouter()
  const supabase = createClient()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = user.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase()

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        {/* Mobile menu trigger — placeholder for Phase 2 */}
        <h2 className="text-slate-300 text-sm font-medium">NeuroClass</h2>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 hover:bg-slate-800 rounded-lg px-2 py-1.5 transition"
        >
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
          )}
          <span className="text-slate-300 text-sm">{user.full_name ?? user.email}</span>
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
            <a href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 transition">
              <span>⚙️</span> Settings
            </a>
            <div className="border-t border-slate-700" />
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-slate-700 transition"
            >
              <span>🚨</span> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
