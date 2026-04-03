'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Role = 'student' | 'instructor' | 'admin'

interface NavItem {
  label: string
  href: string
  icon: string
  roles?: Role[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'Courses', href: '/dashboard/courses', icon: '📚' },
  { label: 'Projects', href: '/dashboard/projects', icon: '🛠️' },
  { label: 'Grades', href: '/dashboard/grades', icon: '📊', roles: ['student'] },
  { label: 'Lectures', href: '/dashboard/lectures', icon: '🎬', roles: ['instructor'] },
  { label: 'Rubrics', href: '/dashboard/rubrics', icon: '📋', roles: ['instructor'] },
  { label: 'Approvals', href: '/dashboard/instructor/approvals', icon: '✅', roles: ['instructor'] },
  { label: 'Analytics', href: '/dashboard/instructor/analytics', icon: '📈', roles: ['instructor'] },
  { label: 'Admin', href: '/dashboard/admin', icon: '🔧', roles: ['admin'] },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
]

interface SidebarProps {
  role: Role
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role)
  )

  return (
    <aside className="hidden md:flex w-60 flex-col bg-slate-900 border-r border-slate-800 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5 text-white" stroke="currentColor" strokeWidth={2}>
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
          </svg>
        </div>
        <span className="font-bold text-white text-[15px]">NeuroClass</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-violet-600/20 text-violet-300 font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Role badge */}
      <div className="px-4 py-4 border-t border-slate-800">
        <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-400 capitalize">
          {role}
        </span>
      </div>
    </aside>
  )
}
