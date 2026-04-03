import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

/**
 * Browser-side Supabase singleton.
 * Use this in Client Components ('use client').
 * Never import this in Server Components or Route Handlers.
 */
let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function getSupabaseBrowserClient() {
  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}
