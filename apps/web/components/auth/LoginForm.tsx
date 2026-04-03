'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = '/dashboard' }: LoginFormProps) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div
          role="alert"
          className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm"
        >
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm
                     placeholder:text-muted-foreground focus:outline-none focus:ring-2
                     focus:ring-ring focus:border-transparent transition-shadow"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <a
            href="/auth/forgot-password"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Forgot password?
          </a>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm
                     placeholder:text-muted-foreground focus:outline-none focus:ring-2
                     focus:ring-ring focus:border-transparent transition-shadow"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium
                   hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
