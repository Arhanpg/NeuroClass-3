import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { GoogleOAuthButton } from '@/components/auth/GoogleOAuthButton';

export const metadata: Metadata = {
  title: 'Sign In | NeuroClass',
  description: 'Sign in to your NeuroClass account',
};

interface LoginPageProps {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirectTo ?? '/dashboard';
  const errorMessage =
    params.error === 'oauth_callback_failed'
      ? 'Authentication failed. Please try again.'
      : undefined;

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
          <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your account to continue
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-5">
          {/* Error banner */}
          {errorMessage && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Google OAuth */}
          <GoogleOAuthButton redirectTo={redirectTo} />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {/* Email + Password form */}
          <LoginForm redirectTo={redirectTo} />
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-muted-foreground mt-5">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/register"
            className="text-primary font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
