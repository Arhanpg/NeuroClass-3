import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const cloudRunUrl = process.env.CLOUD_RUN_URL ?? 'http://localhost:8080'

  try {
    const res = await fetch(`${cloudRunUrl}/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AI_SERVICE_SECRET}`,
        'X-User-Id': session.user.id,
        'X-User-Role': session.user.user_metadata?.role ?? 'STUDENT',
      },
      body: JSON.stringify({
        ...body,
        user_id: session.user.id,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ error: errText }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    // AI service unavailable - return a graceful fallback
    return NextResponse.json(
      { response: 'AI service is currently unavailable. Please try again later.', cited_sources: [] },
      { status: 200 }
    )
  }
}
