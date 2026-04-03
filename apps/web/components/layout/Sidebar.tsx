'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils/cn'

const NAV_ITEMS = [
  // ── Shared ──────────────────────────────────────────────────────────────────
  { href: '/dashboard/courses',     label: 'Courses',     roles: ['STUDENT','INSTRUCTOR','TEACHING_ASSISTANT','ADMIN'], icon: BookIcon },
  // ── Student only ─────────────────────────────────────────────────────────────
  { href: '/dashboard/enroll',      label: 'Join Course', roles: ['STUDENT'], icon: LogInIcon },
  { href: '/dashboard/tutor',       label: 'AI Tutor',    roles: ['STUDENT','TEACHING_ASSISTANT'], icon: BotIcon },
  { href: '/dashboard/grades',      label: 'Grades',      roles: ['STUDENT'], icon: GradeIcon },
  // ── Instructor only ───────────────────────────────────────────────────────────
  { href: '/dashboard/courses/new', label: 'New Course',  roles: ['INSTRUCTOR'], icon: PlusIcon },
  { href: '/dashboard/lectures',    label: 'Lectures',    roles: ['INSTRUCTOR','TEACHING_ASSISTANT'], icon: FileTextIcon },
  { href: '/dashboard/rubrics',     label: 'Rubrics',     roles: ['INSTRUCTOR'], icon: ClipboardIcon },
  { href: '/dashboard/instructor',  label: 'Overview',    roles: ['INSTRUCTOR','TEACHING_ASSISTANT'], icon: LayoutIcon },
  // ── Shared lower ─────────────────────────────────────────────────────────────
  { href: '/dashboard/projects',    label: 'Projects',    roles: ['STUDENT','INSTRUCTOR','TEACHING_ASSISTANT'], icon: FolderIcon },
  { href: '/dashboard/leaderboard', label: 'Leaderboard', roles: ['STUDENT','INSTRUCTOR','TEACHING_ASSISTANT'], icon: TrophyIcon },
  // ── Admin ─────────────────────────────────────────────────────────────────────
  { href: '/dashboard/admin',       label: 'Admin',       roles: ['ADMIN'], icon: ShieldIcon },
  // ── Always visible ────────────────────────────────────────────────────────────
  { href: '/dashboard/settings',    label: 'Settings',    roles: ['STUDENT','INSTRUCTOR','TEACHING_ASSISTANT','ADMIN'], icon: SettingsIcon },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile, role } = useAuth()

  const visibleItems = NAV_ITEMS.filter(item =>
    role ? item.roles.includes(role) : false
  )

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 bg-card border-r border-border h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border">
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-label="NeuroClass logo">
          <rect width="36" height="36" rx="8" fill="hsl(var(--primary))" />
          <path d="M10 26V10l8 10 8-10v16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="18" cy="18" r="3" fill="white" />
        </svg>
        <span className="text-sm font-semibold">NeuroClass</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
        {visibleItems.map(item => {
          const Icon = item.icon
          // Exact match for /dashboard/courses to avoid highlighting on sub-routes like /new
          const isActive = item.href === '/dashboard/courses'
            ? pathname === '/dashboard/courses' || pathname.startsWith('/dashboard/courses/')
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      {profile && (
        <div className="px-3 py-3 border-t border-border">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{profile.full_name}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">
                {profile.role.replace('_', ' ').toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

// ── Inline SVG icon components ────────────────────────────────────────────────
function BookIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
}
function LogInIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
}
function PlusIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
}
function BotIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
}
function FolderIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
}
function TrophyIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="8,21 12,21 16,21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H17L15 12H9L7 4Z"/><path d="M5 4H3a2 2 0 0 0 0 4h2"/><path d="M19 4h2a2 2 0 0 1 0 4h-2"/></svg>
}
function GradeIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>
}
function FileTextIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
}
function ClipboardIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
}
function LayoutIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
}
function ShieldIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
}
function SettingsIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
}
