'use client'

const roleLabels: Record<string, string> = {
  STUDENT: 'Student',
  INSTRUCTOR: 'Instructor',
  TEACHING_ASSISTANT: 'TA',
  ADMIN: 'Admin',
}

interface TopBarProps {
  fullName: string
  role: string
  avatarUrl?: string | null
}

export function TopBar({ fullName, role, avatarUrl }: TopBarProps) {
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="h-16 bg-white border-b border-[#d4d1ca] flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-[#28251d]">{fullName}</p>
          <p className="text-xs text-[#7a7974]">{roleLabels[role] ?? role}</p>
        </div>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={fullName}
            width={36}
            height={36}
            className="rounded-full border border-[#d4d1ca] object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#cedcd8] border border-[#d4d1ca] flex items-center justify-center">
            <span className="text-sm font-semibold text-[#01696f]">{initials}</span>
          </div>
        )}
      </div>
    </header>
  )
}
