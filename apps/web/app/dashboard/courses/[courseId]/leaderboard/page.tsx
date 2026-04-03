'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'

interface Entry { id: string; team_name: string; rank: number; overall_score: number; milestone_badge: string; aggregate_pcs: number }

export default function LeaderboardPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const supabase = createBrowserClient()
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    supabase.from('leaderboard_entries').select('*').eq('course_id', courseId).order('rank').then(({ data }) => {
      if (data) setEntries(data)
    })

    const channel = supabase.channel('leaderboard:' + courseId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard_entries', filter: `course_id=eq.${courseId}` },
        payload => {
          setEntries(prev => {
            const updated = payload.new as Entry
            const idx = prev.findIndex(e => e.id === updated.id)
            if (idx > -1) { const next = [...prev]; next[idx] = updated; return next.sort((a,b) => a.rank - b.rank) }
            return [...prev, updated].sort((a,b) => a.rank - b.rank)
          })
        }
      ).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [courseId])

  const BADGE_COLOR: Record<string, string> = { GOLD: 'text-yellow-600', SILVER: 'text-gray-500', BRONZE: 'text-orange-600', NONE: 'text-transparent' }
  const BADGE_ICON: Record<string, string> = { GOLD: '🥇', SILVER: '🥈', BRONZE: '🥉', NONE: '' }

  return (
    <div>
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-6">🏆 Leaderboard</h1>
      {entries.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          <p className="font-medium">No teams ranked yet</p>
          <p className="text-sm mt-1">Leaderboard updates in real-time as projects are graded.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map(e => (
            <div key={e.id} className={`flex items-center gap-4 p-4 bg-[var(--color-surface)] rounded-xl border transition-all ${
              e.rank === 1 ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
            }`}>
              <span className="w-8 text-center font-bold text-[var(--color-text-muted)]">{e.rank}</span>
              <span className="text-lg">{BADGE_ICON[e.milestone_badge]}</span>
              <span className="flex-1 font-medium text-[var(--color-text)]">{e.team_name}</span>
              <div className="text-right">
                <p className="font-bold text-[var(--color-primary)] tabular-nums">{e.overall_score?.toFixed(1) ?? '—'}</p>
                <p className="text-xs text-[var(--color-text-muted)]">PCS: {e.aggregate_pcs?.toFixed(0) ?? '—'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
