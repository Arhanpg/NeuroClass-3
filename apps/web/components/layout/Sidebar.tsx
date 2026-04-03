'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils/cn'

const studentNav = [
  { label: 'Courses', href: '/courses', icon: '📚' },
  { label: 'Enroll', href: '/enroll', icon: '➕' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
]

const instructorNav = [
  { label: 'Dashboard', href: '/instructor', icon: '📊' },
  { label: 'Courses', href: '/courses', icon: '📚' },
  { label: 'Approvals', href: '/instructor/approvals', icon: '✅' },
  { label: 'Analytics', href: '/instructor/analytics', icon: '📈' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile } = useAuth()
  const isInstructor = profile?.role === 'INSTRUCTOR' || profile?.role === 'ADMIN'
  const navItems = isInstructor ? instructorNav : studentNav

  return (
    <aside className="w-60 flex-shrink-0 bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-slate-700">
        <Link href="/dashboard" className="flex items-center gap-2 text-white">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-label="NeuroClass">
            <circle cx="18" cy="18" r="16" stroke="#6366f1" strokeWidth="2" />
            <path d="M10 24 L18 12 L26 24" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="18" cy="12" r="2.5" fill="#6366f1" />
          </svg>
          <span className="font-bold text-base tracking-tight">NeuroClass</span>
        </Link>
      </div>

      {/* Role badge */}
      {profile && (
        <div className="px-5 pt-4 pb-2">
          <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            isInstructor
              ? 'bg-indigo-500/20 text-indigo-300'
              : 'bg-emerald-500/20 text-emerald-300'
          )}>
            {profile.role}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-indigo-600/20 text-indigo-300'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              )}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      {profile && (
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {profile.full_name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile.full_name}</p>
              <p className="text-xs text-slate-400 truncate">{profile.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
