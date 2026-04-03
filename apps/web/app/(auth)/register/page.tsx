import { RegisterForm } from '@/components/auth/RegisterForm'
import { GoogleOAuthButton } from '@/components/auth/GoogleOAuthButton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account | NeuroClass',
  description: 'Create your NeuroClass account',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white mb-2">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-label="NeuroClass">
              <circle cx="18" cy="18" r="16" stroke="#6366f1" strokeWidth="2" />
              <path d="M10 24 L18 12 L26 24" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="18" cy="12" r="2.5" fill="#6366f1" />
            </svg>
            <span className="text-2xl font-bold tracking-tight">NeuroClass</span>
          </div>
          <p className="text-slate-400 text-sm">Autonomous AI Classroom Management</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-xl font-semibold text-white mb-6">Create your account</h1>

          <GoogleOAuthButton label="Sign up with Google" />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-800 px-2 text-slate-400">or register with email</span>
            </div>
          </div>

          <RegisterForm />

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
