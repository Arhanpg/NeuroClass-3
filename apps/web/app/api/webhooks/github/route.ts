import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const payload = await request.json()
  const supabase = createAdminSupabaseClient()

  // Verify it's a push event
  if (!payload.commits || !payload.repository) {
    return NextResponse.json({ ok: true })
  }

  const repoFullName: string = payload.repository.full_name

  // Find matching team
  const { data: team } = await supabase
    .from('teams')
    .select('id')
    .eq('github_repo', repoFullName)
    .single()

  if (!team) {
    return NextResponse.json({ ok: true, message: 'No matching team' })
  }

  // Insert commit logs
  const inserts = payload.commits.map((commit: any) => ({
    team_id: team.id,
    github_sha: commit.id,
    message: commit.message,
    additions: commit.added?.length ?? 0,
    deletions: commit.removed?.length ?? 0,
    files_changed: (commit.added?.length ?? 0) + (commit.removed?.length ?? 0) + (commit.modified?.length ?? 0),
    committed_at: commit.timestamp,
  }))

  await supabase.from('commit_logs').upsert(inserts, { onConflict: 'team_id,github_sha' })

  return NextResponse.json({ ok: true, inserted: inserts.length })
}
