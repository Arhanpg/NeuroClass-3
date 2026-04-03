import { RegisterForm } from '@/components/auth/register-form'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Create Account — NeuroClass' }

export default async function RegisterPage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (session) redirect('/dashboard')

  return (
    <main className="min-h-screen flex items-center justify-center bg-nc-bg px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-nc-text">Create your account</h1>
          <p className="mt-1 text-sm text-nc-muted">Join NeuroClass as a student or instructor</p>
        </div>
        <RegisterForm />
      </div>
    </main>
  )
}
