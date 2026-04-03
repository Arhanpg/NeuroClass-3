'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import type { UserRole } from '@/lib/supabase/types';

interface AuthGuardProps {
  children: React.ReactNode;
  /** If provided, only users with one of these roles can access the page */
  allowedRoles?: UserRole[];
  /** Where to redirect if user is not authenticated (default: /auth/login) */
  redirectTo?: string;
  /** Where to redirect if user is authenticated but lacks the required role */
  unauthorizedRedirect?: string;
  /** Shown while session is loading */
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  allowedRoles,
  redirectTo = '/auth/login',
  unauthorizedRedirect = '/dashboard',
  fallback = <AuthGuardSkeleton />,
}: AuthGuardProps) {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(`${redirectTo}?redirectTo=${window.location.pathname}`);
      return;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
      router.replace(unauthorizedRedirect);
    }
  }, [user, role, loading, allowedRoles, redirectTo, unauthorizedRedirect, router]);

  if (loading) return <>{fallback}</>;
  if (!user) return null;
  if (allowedRoles && role && !allowedRoles.includes(role)) return null;

  return <>{children}</>;
}

function AuthGuardSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          aria-label="NeuroClass logo"
          className="text-primary animate-pulse"
        >
          <rect width="36" height="36" rx="8" fill="currentColor" />
          <path d="M10 18 Q18 8 26 18 Q18 28 10 18Z" fill="white" opacity="0.9" />
          <circle cx="18" cy="18" r="3" fill="white" />
        </svg>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}
