import { createServerClient as _createServerClient } from '@supabase/ssr'
import { createClient as _createAdminClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from './types'

/** Server Component / Route Handler client — respects the user's session cookie */
export async function createClient() {
  const cookieStore = await cookies()
  return _createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignored in Server Components — cookies can only be set in middleware/route handlers
          }
        },
      },
    }
  )
}

/** Service-role admin client — bypasses RLS, server-only */
export function createAdminClient() {
  return _createAdminClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
