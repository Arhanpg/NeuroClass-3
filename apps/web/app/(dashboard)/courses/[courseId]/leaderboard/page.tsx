import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Leaderboard – NeuroClass' };

export default async function LeaderboardPage({
  params,
}: {
  params: { courseId: string };
}) {
  const supabase = createServerSupabaseClient();

  const { data: course } = await supabase
    .from('courses')
    .select('id, name')
    .eq('id', params.courseId)
    .single();

  if (!course) notFound();

  const { data: entries } = await supabase
    .from('leaderboard_entries')
    .select('*')
    .eq('course_id', params.courseId)
    .order('rank', { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">{course.name}</p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Rank</th>
              <th className="px-4 py-3 text-left font-medium">Team</th>
              <th className="px-4 py-3 text-right font-medium">Score</th>
              <th className="px-4 py-3 text-right font-medium">Badge</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {entries?.map((entry) => (
              <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono tabular-nums">{entry.rank}</td>
                <td className="px-4 py-3 font-medium">{entry.team_name}</td>
                <td className="px-4 py-3 text-right tabular-nums">{entry.overall_score?.toFixed(1)}</td>
                <td className="px-4 py-3 text-right">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{entry.milestone_badge ?? 'NONE'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!entries || entries.length === 0) && (
          <div className="text-center py-10 text-muted-foreground">No leaderboard data yet.</div>
        )}
      </div>
    </div>
  );
}
