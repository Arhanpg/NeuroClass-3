import { createServerClient } from '@/lib/supabase/server'
import { toLetterGrade } from '@/lib/utils/grade'

export const metadata = { title: 'My Grades' }

export default async function GradesPage({ params }: { params: { courseId: string } }) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  const { data: grades } = await supabase
    .from('released_grades')
    .select('*, projects(title, grade_weight_pct)')
    .eq('student_id', session!.user.id)
    .order('released_at', { ascending: false })

  return (
    <div>
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-6">My Grades</h1>
      {!grades?.length ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          <p className="font-medium">No grades released yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {grades.map(g => (
            <div key={g.id} className="p-4 bg-[var(--color-surface)] rounded-xl border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-[var(--color-text)]">{(g as any).projects?.title}</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Weight: {(g as any).projects?.grade_weight_pct}%</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[var(--color-primary)]">{g.letter_grade}</span>
                  <p className="text-xs text-[var(--color-text-muted)] tabular-nums">{g.normalized_score?.toFixed(1)}/100</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">{g.feedback_summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
