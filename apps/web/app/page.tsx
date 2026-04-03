import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

export default async function RootPage() {
  // Attempt to get Supabase session; if authenticated redirect to dashboard
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      redirect('/dashboard')
    } else {
      redirect('/login')
    }
  } catch {
    // Supabase not yet configured — show placeholder
    redirect('/login')
  }
}
