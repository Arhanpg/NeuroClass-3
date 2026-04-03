import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify instructor
  const { data: course } = await supabase.from('courses').select('instructor_id').eq('id', params.courseId).single()
  if (!course || course.instructor_id !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { lecture_id } = body

  // Invoke Supabase Edge Function for RAG ingestion
  const { data, error } = await supabase.functions.invoke('rag-ingest', {
    body: { course_id: params.courseId, lecture_id },
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
