'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type Role = 'STUDENT' | 'INSTRUCTOR';

export function RegisterForm() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: fullName.trim(), role },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // After sign-up Supabase sends a confirmation email.
    // Show success state instead of redirecting immediately.
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-4 space-y-2">
        <div className="text-4xl">📬</div>
        <p className="font-semibold text-foreground">Check your email</p>
        <p className="text-sm text-muted-foreground">
          We sent a confirmation link to <strong>{email}</strong>.
          Click it to activate your account.
        </p>
      </div>
    );
  }

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

      {/* Full name */}
      <div className="space-y-1.5">
        <label htmlFor="full-name" className="text-sm font-medium text-foreground">
          Full name
        </label>
        <input
          id="full-name"
          type="text"
          autoComplete="name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Arjun Sharma"
          className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm
                     placeholder:text-muted-foreground focus:outline-none focus:ring-2
                     focus:ring-ring focus:border-transparent transition-shadow"
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="reg-email" className="text-sm font-medium text-foreground">
          Email address
        </label>
        <input
          id="reg-email"
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

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="reg-password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm
                     placeholder:text-muted-foreground focus:outline-none focus:ring-2
                     focus:ring-ring focus:border-transparent transition-shadow"
        />
      </div>

      {/* Role selector */}
      <div className="space-y-1.5">
        <span className="text-sm font-medium text-foreground">I am a</span>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {(['STUDENT', 'INSTRUCTOR'] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`h-10 rounded-lg border text-sm font-medium transition-colors
                ${
                  role === r
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
            >
              {r === 'STUDENT' ? '🎓 Student' : '👨‍🏫 Instructor'}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium
                   hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}
