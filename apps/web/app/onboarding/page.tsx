'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    role: '' as 'student' | 'instructor' | '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.full_name || !formData.role) return

    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email!,
        full_name: formData.full_name,
        role: formData.role as 'student' | 'instructor',
        avatar_url: user.user_metadata?.avatar_url ?? null,
      })

      if (upsertError) throw upsertError

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-white">Welcome to NeuroClass</span>
          <p className="text-slate-400 mt-1 text-sm">Let&apos;s set up your account in 1 minute</p>
        </div>

        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  step >= s ? 'bg-violet-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">What&apos;s your name?</h2>
                  <p className="text-slate-400 text-sm mb-4">This is how you&apos;ll appear to others</p>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData((f) => ({ ...f, full_name: e.target.value }))}
                    placeholder="Full name"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                    required
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={() => formData.full_name && setStep(2)}
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-lg py-3 font-medium transition"
                >
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">I am a...</h2>
                  <p className="text-slate-400 text-sm mb-4">Choose your primary role on NeuroClass</p>
                  <div className="grid grid-cols-2 gap-3">
                    {(['student', 'instructor'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setFormData((f) => ({ ...f, role: r }))}
                        className={`p-4 rounded-xl border-2 text-left transition ${
                          formData.role === r
                            ? 'border-violet-500 bg-violet-500/10'
                            : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                        }`}
                      >
                        <div className="text-2xl mb-2">{r === 'student' ? '📚' : '🎯'}</div>
                        <div className="text-white font-medium capitalize">{r}</div>
                        <div className="text-slate-400 text-xs mt-0.5">
                          {r === 'student' ? 'Learn and collaborate' : 'Teach and evaluate'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-slate-600 text-slate-300 rounded-lg py-3 font-medium hover:bg-slate-700 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.role || loading}
                    className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg py-3 font-medium transition"
                  >
                    {loading ? 'Saving...' : 'Get started'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
