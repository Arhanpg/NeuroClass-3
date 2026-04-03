import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

const pedagogyColor: Record<string, string> = {
  SOCRATIC: 'bg-indigo-500/20 text-indigo-300',
  DIRECT: 'bg-blue-500/20 text-blue-300',
  INQUIRY: 'bg-emerald-500/20 text-emerald-300',
  PROJECT_BASED: 'bg-amber-500/20 text-amber-300',
}

interface Props {
  course: {
    id: string
    name: string
    code: string
    term: string
    pedagogy_style: string
    is_active: boolean
    join_code?: string
  }
  isInstructor: boolean
}

export function CourseCard({ course, isInstructor }: Props) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="block bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-indigo-500/50 rounded-xl p-5 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          pedagogyColor[course.pedagogy_style] ?? 'bg-slate-600 text-slate-300'
        )}>
          {course.pedagogy_style.replace('_', ' ')}
        </span>
        <span className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium',
          course.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600/40 text-slate-400'
        )}>
          {course.is_active ? 'Active' : 'Archived'}
        </span>
      </div>

      <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors mb-1 line-clamp-2">
        {course.name}
      </h3>
      <p className="text-sm text-slate-400">{course.code} &middot; {course.term}</p>

      {isInstructor && course.join_code && (
        <p className="mt-3 text-xs text-slate-500 font-mono">
          Join: <span className="text-slate-300 tracking-widest">{course.join_code}</span>
        </p>
      )}
    </Link>
  )
}
