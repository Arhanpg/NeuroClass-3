'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';

interface EnrollFormProps {
  onEnroll: (joinCode: string) => Promise<void>;
  loading?: boolean;
}

export function EnrollForm({ onEnroll, loading }: EnrollFormProps) {
  const [code,    setCode]    = useState('');
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!code.trim()) return;
    try {
      await onEnroll(code.trim());
      setSuccess('Successfully enrolled! Redirecting…');
      setCode('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Enrollment failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      <div className="space-y-1.5">
        <Label htmlFor="join-code">Join Code</Label>
        <Input
          id="join-code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. a3f9c1d2"
          className="font-mono tracking-widest"
          maxLength={16}
          autoComplete="off"
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          Ask your instructor for the 8-character join code.
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">{error}</p>
      )}
      {success && (
        <p role="status" className="text-sm text-green-600 dark:text-green-400">{success}</p>
      )}

      <Button type="submit" disabled={loading || !code.trim()}>
        {loading ? 'Joining…' : 'Join Course'}
      </Button>
    </form>
  );
}
