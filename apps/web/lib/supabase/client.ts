import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

/**
 * Returns a singleton Supabase browser client.
 * Safe to call multiple times — only one instance is created.
 */
export function createClient() {
  if (client) return client

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}
