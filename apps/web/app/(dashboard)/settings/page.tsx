'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default function SettingsPage() {
  const { profile, signOut } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="border rounded-lg divide-y">
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Dark Mode</p>
            <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="p-4">
          <p className="font-medium">Account</p>
          <p className="text-sm text-muted-foreground mt-1">{profile?.email}</p>
          <p className="text-xs text-muted-foreground">{profile?.role}</p>
        </div>

        <div className="p-4">
          <button
            onClick={signOut}
            className="text-sm text-destructive hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
