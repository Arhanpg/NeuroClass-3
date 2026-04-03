import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const cloudRunUrl = process.env.CLOUD_RUN_URL ?? 'http://localhost:8080'

  try {
    const response = await fetch(`${cloudRunUrl}/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Secret': process.env.AI_SERVICE_SECRET ?? '',
        'X-User-Id': user.id,
      },
      body: JSON.stringify({ ...body, user_id: user.id }),
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: err }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[AI invoke] error:', err)
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 })
  }
}
