'use client';

import { useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Profile, UserRole } from '@/lib/supabase/types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    role: null,
    session: null,
    loading: true,
    error: null,
  });

  const supabase = getSupabaseBrowserClient();

  const fetchProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[useAuth] fetchProfile error:', error.message);
        return null;
      }
      return data as Profile;
    },
    [supabase]
  );

  useEffect(() => {
    let mounted = true;

    // Get the initial session
    const initSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error || !session) {
        setState((prev) => ({ ...prev, loading: false }));
        return;
      }

      const profile = await fetchProfile(session.user.id);

      if (!mounted) return;
      setState({
        user: session.user,
        session,
        profile,
        role: profile?.role ?? null,
        loading: false,
        error: null,
      });
    };

    initSession();

    // Subscribe to auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session) {
          setState({ user: null, profile: null, role: null, session: null, loading: false, error: null });
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          const profile = await fetchProfile(session.user.id);
          if (!mounted) return;
          setState({
            user: session.user,
            session,
            profile,
            role: profile?.role ?? null,
            loading: false,
            error: null,
          });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  return { ...state, signOut };
}
