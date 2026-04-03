import Link from 'next/link'

interface CourseCardProps {
  course: {
    id: string
    name: string
    code: string
    term: string
    join_code: string
    pedagogy_style: string
    is_archived: boolean
    profiles?: { full_name: string; avatar_url?: string } | null
  }
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/dashboard/courses/${course.id}`}
      className="block p-5 bg-[var(--color-surface)] rounded-xl border border-gray-200 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">{course.name}</h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{course.code} · {course.term}</p>
        </div>
        {course.is_archived && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Archived</span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-medium">
          {course.pedagogy_style.replace(/_/g, ' ')}
        </span>
        {course.profiles && (
          <span className="text-xs text-[var(--color-text-muted)]">by {course.profiles.full_name}</span>
        )}
      </div>
    </Link>
  )
}
