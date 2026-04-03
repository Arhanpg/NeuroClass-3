import { OnboardingForm } from '@/components/auth/onboarding-form'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Complete Your Profile — NeuroClass' }

export default async function OnboardingPage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  return (
    <main className="min-h-screen flex items-center justify-center bg-nc-bg px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-nc-text">Complete your profile</h1>
          <p className="mt-1 text-sm text-nc-muted">Tell us a bit about yourself</p>
        </div>
        <OnboardingForm />
      </div>
    </main>
  )
}
