'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AuthCard } from '@/components/auth/AuthCard'
import { AuthInput } from '@/components/auth/AuthInput'
import { AuthButton } from '@/components/auth/AuthButton'
import { AuthDivider } from '@/components/auth/AuthDivider'
import { OAuthButton } from '@/components/auth/OAuthButton'
import { RolePicker } from '@/components/auth/RolePicker'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'STUDENT' | 'INSTRUCTOR'>('STUDENT')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  async function handleGitHubLogin() {
    setOauthLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setOauthLoading(false)
    }
  }

  if (success) {
    return (
      <AuthCard
        title="Check your email"
        description={`We sent a confirmation link to ${email}`}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-[#cedcd8] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#01696f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-sm text-[#7a7974]">
            Click the link in the email to confirm your account and get started.
          </p>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Create your account"
      description="Join NeuroClass and transform how you learn"
    >
      <OAuthButton
        provider="github"
        label="Sign up with GitHub"
        onClick={handleGitHubLogin}
        loading={oauthLoading}
      />

      <AuthDivider label="or sign up with email" />

      <form onSubmit={handleSignup} className="space-y-4">
        <AuthInput
          id="full_name"
          label="Full name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Arhan Ghosarwade"
          autoComplete="name"
          required
        />
        <AuthInput
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <AuthInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          required
          minLength={8}
        />

        <RolePicker value={role} onChange={setRole} />

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <AuthButton loading={loading} label="Create account" />
      </form>

      <p className="text-center text-sm text-[#7a7974] mt-4">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-[#01696f] hover:text-[#0c4e54] font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  )
}
