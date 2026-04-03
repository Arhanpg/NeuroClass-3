import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { grade_id, project_id, team_name } = await req.json()
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get the course instructor
    const { data: project } = await supabase
      .from('projects')
      .select('course_id, courses(instructor_id)')
      .eq('id', project_id)
      .single()

    if (!project) return new Response('ok', { headers: corsHeaders })

    const instructorId = (project.courses as any)?.instructor_id

    // Insert notification
    await supabase.from('notifications').insert({
      user_id: instructorId,
      type: 'HITL_NEEDED',
      title: 'Grade Review Required',
      body: `AI has graded "${team_name}". Review and approve or override the score.`,
      metadata: { grade_id, project_id },
    })

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
