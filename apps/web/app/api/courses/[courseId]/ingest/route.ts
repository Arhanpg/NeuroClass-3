import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

interface IngestBody {
  lecture_id: string;
  storage_path: string;
  file_type: 'PDF' | 'MARKDOWN';
}

export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const supabase = createServerClient();

    // Validate session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check instructor role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['INSTRUCTOR', 'TEACHING_ASSISTANT', 'ADMIN'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden: instructor role required' }, { status: 403 });
    }

    // Verify instructor owns this course
    const { data: course } = await supabase
      .from('courses')
      .select('id, instructor_id')
      .eq('id', params.courseId)
      .single();

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.instructor_id !== user.id && profile.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body: IngestBody = await req.json();

    // Mark lecture as PROCESSING
    await supabase
      .from('lectures')
      .update({ embedding_status: 'PROCESSING' })
      .eq('id', body.lecture_id);

    // Call Supabase Edge Function: rag-ingest
    // This is non-blocking — we fire and forget. The Edge Function calls the Python AI service.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const edgeFnResponse = await fetch(`${supabaseUrl}/functions/v1/rag-ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        course_id: params.courseId,
        lecture_id: body.lecture_id,
        storage_path: body.storage_path,
        file_type: body.file_type,
      }),
    }).catch(() => null); // Non-fatal

    return NextResponse.json({
      success: true,
      ingestion_triggered: edgeFnResponse?.ok ?? false,
      lecture_id: body.lecture_id,
    });
  } catch (err: any) {
    console.error('[ingest route]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}
