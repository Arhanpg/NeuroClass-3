'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const { profile, signOut } = useAuth()

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card shrink-0">
      {/* Left: page context (mobile hamburger placeholder) */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button — full mobile nav added in Phase 2 */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          aria-label="Open navigation"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Notification bell — wired in Phase 4 */}
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Notifications"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>

        {/* User menu */}
        {profile && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={signOut}
              className="hidden md:block text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
