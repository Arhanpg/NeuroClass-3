import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const metadata = { title: 'Reset Password — NeuroClass' }

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-nc-bg px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-nc-text">Reset your password</h1>
          <p className="mt-1 text-sm text-nc-muted">We\'ll send a link to your email</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </main>
  )
}
