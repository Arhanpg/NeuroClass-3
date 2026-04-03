import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NeuroClass — Sign In',
  description: 'AI-powered classroom experience',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <a href="/" className="flex items-center gap-2 group">
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              aria-label="NeuroClass logo"
              className="text-[#01696f]"
            >
              <rect width="36" height="36" rx="10" fill="currentColor" />
              <path
                d="M10 26V10l8 10 8-10v16"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="18" cy="12" r="2" fill="white" />
            </svg>
            <span className="text-xl font-semibold text-[#28251d] tracking-tight">
              NeuroClass
            </span>
          </a>
        </div>
        {children}
      </div>
    </div>
  )
}
