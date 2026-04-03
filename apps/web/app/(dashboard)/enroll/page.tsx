'use client'

import { useState } from 'react'
import { useCourses } from '@/lib/hooks/useCourses'
import { useRouter } from 'next/navigation'
import type { Metadata } from 'next'

export default function EnrollPage() {
  const router = useRouter()
  const { enrollByCode } = useCourses()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await enrollByCode(code.trim().toUpperCase())
    if (error) {
      setError(error)
      setLoading(false)
    } else {
      router.push('/courses')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Enroll in a Course</h1>
      <p className="text-slate-400 text-sm mb-6">Enter the join code provided by your instructor.</p>

      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>
        )}
        <div>
          <label htmlFor="join_code" className="block text-sm font-medium text-slate-300 mb-1.5">
            Join Code
          </label>
          <input
            id="join_code" type="text" required maxLength={8}
            value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-3.5 py-2.5 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="ABCD1234"
          />
        </div>
        <button
          type="submit" disabled={loading || code.length < 4}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors"
        >
          {loading ? 'Enrolling…' : 'Enroll'}
        </button>
      </form>
    </div>
  )
}
