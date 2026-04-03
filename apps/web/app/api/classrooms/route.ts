import { createAdminClient, createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  let query
  if (profile?.role === 'instructor') {
    const { data, error } = await supabase.from('classrooms').select('*').eq('instructor_id', user.id).order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ classrooms: data })
  } else {
    const { data, error } = await supabase.from('enrollments').select('classroom:classrooms(*)').eq('student_id', user.id).eq('status', 'active')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ classrooms: (data ?? []).map((e: any) => e.classroom) })
  }
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, description, subject } = body
  if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 })

  const { data, error } = await supabase
    .from('classrooms')
    .insert({ name, description, subject, instructor_id: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ classroom: data }, { status: 201 })
}
