import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'INSTRUCTOR') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();

  // Invoke Supabase Edge Function for RAG ingestion
  const { data, error: fnError } = await supabase.functions.invoke('rag-ingest', {
    body: { course_id: params.courseId, ...body },
  });

  if (fnError) return NextResponse.json({ error: fnError.message }, { status: 500 });
  return NextResponse.json(data);
}
