import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

asyNC function verifyGitHubSignature(body: string, signature: string | null): Promise<boolean> {
  if (!signature || !process.env.GITHUB_WEBHOOK_SECRET) return Promise.resolve(false)
  const secret = process.env.GITHUB_WEBHOOK_SECRET
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
  const hex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
  return `sha256=${hex}` === signature
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-hub-signature-256')

  const valid = await verifyGitHubSignature(body, signature)
  if (!valid) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })

  const event = request.headers.get('x-github-event')
  if (event !== 'push') return NextResponse.json({ ok: true })

  const payload = JSON.parse(body)
  // Queue processing via Edge Function
  await supabaseAdmin.functions.invoke('github-sync', { body: { payload } })

  return NextResponse.json({ ok: true })
}
