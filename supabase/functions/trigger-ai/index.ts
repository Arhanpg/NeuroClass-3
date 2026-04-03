import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const cloudRunUrl = Deno.env.get('CLOUD_RUN_URL') ?? 'http://localhost:8080'
    const aiSecret = Deno.env.get('AI_SERVICE_SECRET') ?? ''

    const supabase = createClient(supabaseUrl, serviceKey)
    const body = await req.json()
    const { interaction_id, course_id, student_id } = body

    // Fetch the interaction
    const { data: interaction } = await supabase
      .from('interactions')
      .select('*')
      .eq('id', interaction_id)
      .single()

    if (!interaction) {
      return new Response(JSON.stringify({ error: 'Interaction not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Forward to Cloud Run AI service
    const aiResponse = await fetch(`${cloudRunUrl}/tutor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Secret': aiSecret,
      },
      body: JSON.stringify({ interaction, course_id, student_id }),
    })

    const result = await aiResponse.json()

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
