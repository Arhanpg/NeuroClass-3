'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleRoleSelect = async (role: string) => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    await supabase.from('profiles').update({ role }).eq('id', user.id)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-lg text-center">
        <svg className="mx-auto mb-6" width="48" height="48" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="16" stroke="#6366f1" strokeWidth="2" />
          <path d="M10 24 L18 12 L26 24" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="12" r="2.5" fill="#6366f1" />
        </svg>
        <h1 className="text-2xl font-bold text-white mb-2">Welcome to NeuroClass</h1>
        <p className="text-slate-400 mb-8">Tell us who you are to get started.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            disabled={loading}
            onClick={() => handleRoleSelect('STUDENT')}
            className="bg-slate-800 hover:bg-slate-700 border-2 border-emerald-500/30 hover:border-emerald-500 text-white rounded-xl p-6 text-left transition-all"
          >
            <div className="text-3xl mb-3">🎓</div>
            <h2 className="font-semibold mb-1">I&apos;m a Student</h2>
            <p className="text-sm text-slate-400">Enroll in courses and get AI-powered tutoring and feedback</p>
          </button>

          <button
            disabled={loading}
            onClick={() => handleRoleSelect('INSTRUCTOR')}
            className="bg-slate-800 hover:bg-slate-700 border-2 border-indigo-500/30 hover:border-indigo-500 text-white rounded-xl p-6 text-left transition-all"
          >
            <div className="text-3xl mb-3">👨‍🏫</div>
            <h2 className="font-semibold mb-1">I&apos;m an Instructor</h2>
            <p className="text-sm text-slate-400">Create courses, manage students, and review AI-generated grades</p>
          </button>
        </div>
      </div>
    </div>
  )
}
