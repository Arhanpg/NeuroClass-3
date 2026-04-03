import type { ReactNode } from 'react'

interface AuthCardProps {
  title: string
  description: string
  children: ReactNode
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#d4d1ca] shadow-sm p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#28251d] tracking-tight">
          {title}
        </h1>
        <p className="mt-1 text-sm text-[#7a7974]">{description}</p>
      </div>
      {children}
    </div>
  )
}
