'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_STUDENT = [
  { href: '/dashboard/courses', label: 'Courses', icon: '📖' },
  { href: '/dashboard/enroll', label: 'Enroll', icon: '➕' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
]

const NAV_INSTRUCTOR = [
  { href: '/dashboard/instructor', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/courses', label: 'Courses', icon: '📖' },
  { href: '/dashboard/courses/new', label: 'New Course', icon: '➕' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
]

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname()
  const nav = (role === 'INSTRUCTOR' || role === 'TEACHING_ASSISTANT') ? NAV_INSTRUCTOR : NAV_STUDENT

  return (
    <aside className="w-56 flex-shrink-0 bg-[var(--color-surface)] border-r border-gray-200 flex flex-col py-4">
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="NeuroClass">
            <rect width="28" height="28" rx="7" fill="#01696f"/>
            <path d="M7 20V8l7 6 7-6v12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="14" cy="14" r="2" fill="white"/>
          </svg>
          <span className="font-bold text-[var(--color-text)] text-base">NeuroClass</span>
        </div>
      </div>
      <nav className="flex-1 px-2 space-y-0.5">
        {nav.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-teal-50 text-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] hover:bg-gray-100 hover:text-[var(--color-text)]'
              }`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="px-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-[var(--color-text-muted)] truncate">{role.replace('_', ' ')}</p>
      </div>
    </aside>
  )
}
