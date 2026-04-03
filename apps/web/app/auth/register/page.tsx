import { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { GoogleOAuthButton } from '@/components/auth/GoogleOAuthButton';

export const metadata: Metadata = {
  title: 'Create Account | NeuroClass',
  description: 'Create your NeuroClass account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              aria-label="NeuroClass logo"
              className="text-primary"
            >
              <rect width="36" height="36" rx="8" fill="currentColor" />
              <path
                d="M10 18 Q18 8 26 18 Q18 28 10 18Z"
                fill="white"
                opacity="0.9"
              />
              <circle cx="18" cy="18" r="3" fill="white" />
            </svg>
            <span className="text-2xl font-bold text-foreground tracking-tight">
              NeuroClass
            </span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join NeuroClass as a student or instructor
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-5">
          {/* Google OAuth */}
          <GoogleOAuthButton redirectTo="/dashboard" />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">or register with email</span>
            </div>
          </div>

          {/* Registration form */}
          <RegisterForm />
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-muted-foreground mt-5">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
