interface AuthDividerProps {
  label?: string
}

export function AuthDivider({ label = 'or' }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-[#d4d1ca]" />
      <span className="text-xs text-[#7a7974] font-medium">{label}</span>
      <div className="flex-1 h-px bg-[#d4d1ca]" />
    </div>
  )
}
