interface GradeCardProps {
  grade: {
    letter_grade: string
    normalized_score: number
    feedback_summary: string
    show_detailed_criteria: boolean
    criteria_details?: any
    instructor_approved_at: string
  }
  projectTitle?: string
}

export function GradeCard({ grade, projectTitle }: GradeCardProps) {
  const scoreColor = grade.normalized_score >= 85 ? 'text-green-600' : grade.normalized_score >= 70 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="p-5 bg-[var(--color-surface)] rounded-xl border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          {projectTitle && <h3 className="font-semibold text-[var(--color-text)]">{projectTitle}</h3>}
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Approved {new Date(grade.instructor_approved_at).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <span className={`text-3xl font-bold ${scoreColor}`}>{grade.letter_grade}</span>
          <p className={`text-sm font-mono ${scoreColor}`}>{grade.normalized_score.toFixed(1)}/100</p>
        </div>
      </div>
      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{grade.feedback_summary}</p>
      {grade.show_detailed_criteria && grade.criteria_details && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Criteria Breakdown</p>
          {Object.entries(grade.criteria_details as Record<string, any>).map(([name, detail]) => (
            <div key={name} className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-text)]">{name}</span>
              <span className="font-mono text-[var(--color-primary)]">{typeof detail === 'object' ? detail.score : detail}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
