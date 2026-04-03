import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const cloudRunUrl = process.env.CLOUD_RUN_URL;
  const secret = process.env.AI_SERVICE_SECRET;

  if (!cloudRunUrl) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
  }

  const response = await fetch(`${cloudRunUrl}/invoke`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Service-Secret': secret ?? '',
      'X-User-Id': user.id,
    },
    body: JSON.stringify({ ...body, student_id: user.id }),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
