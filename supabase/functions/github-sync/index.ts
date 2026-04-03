import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Scheduled Edge Function: syncs GitHub commits for all active teams
// Trigger via Supabase cron or pg_cron every hour
serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  const githubToken = Deno.env.get('GITHUB_TOKEN') ?? ''

  const { data: teams } = await supabase
    .from('teams')
    .select('id, github_repo')
    .not('github_repo', 'is', null)

  if (!teams || teams.length === 0) {
    return new Response(JSON.stringify({ synced: 0 }), { status: 200 })
  }

  let synced = 0

  for (const team of teams) {
    if (!team.github_repo) continue

    const res = await fetch(
      `https://api.github.com/repos/${team.github_repo}/commits?per_page=30`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )

    if (!res.ok) continue
    const commits = await res.json()

    const inserts = commits.map((c: any) => ({
      team_id: team.id,
      github_sha: c.sha,
      message: c.commit.message,
      additions: c.stats?.additions ?? 0,
      deletions: c.stats?.deletions ?? 0,
      files_changed: c.files?.length ?? 0,
      committed_at: c.commit.author.date,
    }))

    await supabase
      .from('commit_logs')
      .upsert(inserts, { onConflict: 'team_id,github_sha', ignoreDuplicates: true })

    synced += inserts.length
  }

  return new Response(JSON.stringify({ synced }), { status: 200 })
})
