import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { lecture_id, course_id } = await req.json()
    const cloudRunUrl = Deno.env.get('CLOUD_RUN_URL') ?? 'http://localhost:8080'
    const aiSecret = Deno.env.get('AI_SERVICE_SECRET') ?? ''
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Mark as processing
    await supabase.from('lectures').update({ embed_status: 'PROCESSING' }).eq('id', lecture_id)

    // Trigger Python ingestion pipeline
    const res = await fetch(`${cloudRunUrl}/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Service-Secret': aiSecret },
      body: JSON.stringify({ lecture_id, course_id }),
    })

    if (!res.ok) {
      await supabase.from('lectures').update({ embed_status: 'FAILED' }).eq('id', lecture_id)
      return new Response(JSON.stringify({ error: 'Ingestion failed' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    await supabase.from('lectures').update({ embed_status: 'DONE' }).eq('id', lecture_id)
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
