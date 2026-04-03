interface RolePickerProps {
  value: 'STUDENT' | 'INSTRUCTOR'
  onChange: (role: 'STUDENT' | 'INSTRUCTOR') => void
}

export function RolePicker({ value, onChange }: RolePickerProps) {
  const roles = [
    {
      key: 'STUDENT' as const,
      label: 'Student',
      description: 'I want to learn and take courses',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    {
      key: 'INSTRUCTOR' as const,
      label: 'Instructor',
      description: 'I want to create and manage courses',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      ),
    },
  ]

  return (
    <div>
      <p className="block text-sm font-medium text-[#28251d] mb-2">I am a…</p>
      <div className="grid grid-cols-2 gap-3">
        {roles.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => onChange(r.key)}
            className={`flex flex-col items-start gap-1.5 p-3 rounded-lg border text-left transition-all duration-150 ${
              value === r.key
                ? 'border-[#01696f] bg-[#cedcd8] ring-1 ring-[#01696f]'
                : 'border-[#d4d1ca] bg-[#f9f8f5] hover:bg-[#f3f0ec]'
            }`}
          >
            <span
              className={`${
                value === r.key ? 'text-[#01696f]' : 'text-[#7a7974]'
              }`}
            >
              {r.icon}
            </span>
            <span className="text-sm font-medium text-[#28251d]">{r.label}</span>
            <span className="text-xs text-[#7a7974] leading-tight">{r.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
