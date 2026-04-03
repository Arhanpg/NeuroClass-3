import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { join_code } = await req.json()
  if (!join_code) return NextResponse.json({ error: 'join_code is required' }, { status: 400 })

  // Find classroom by join code
  const { data: classroom, error: classroomError } = await supabase
    .from('classrooms')
    .select('id, name, is_archived')
    .eq('join_code', join_code.toUpperCase())
    .single()

  if (classroomError || !classroom) return NextResponse.json({ error: 'Invalid join code' }, { status: 404 })
  if (classroom.is_archived) return NextResponse.json({ error: 'This classroom is archived' }, { status: 400 })

  // Enroll student
  const { data, error } = await supabase
    .from('enrollments')
    .upsert({ classroom_id: classroom.id, student_id: user.id, status: 'active' }, { onConflict: 'classroom_id,student_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ enrollment: data, classroom }, { status: 201 })
}
