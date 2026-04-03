import Link from 'next/link'
import { formatRelative } from '@/lib/utils/date'

interface Course {
  id: string
  name: string
  code: string
  term: string
  join_code: string
  enrollment_cap: number
  is_archived: boolean
  created_at: string
}

interface InstructorDashboardProps {
  profile: { full_name: string; role: string }
  courses: Course[]
  enrollmentCounts: Record<string, number>
}

export function InstructorDashboard({
  profile,
  courses,
  enrollmentCounts,
}: InstructorDashboardProps) {
  const totalStudents = Object.values(enrollmentCounts).reduce((s, v) => s + v, 0)

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#28251d]">
          Welcome back, {profile.full_name.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-[#7a7974] mt-1">
          Manage your courses and track student progress
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Active Courses', value: courses.length },
          { label: 'Total Students', value: totalStudents },
          { label: 'Avg. Enrollment', value: courses.length ? Math.round(totalStudents / courses.length) : 0 },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-[#d4d1ca] p-5">
            <p className="text-3xl font-bold text-[#28251d] tabular-nums">{stat.value}</p>
            <p className="text-sm text-[#7a7974] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Courses */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#28251d]">Your Courses</h2>
        <Link
          href="/courses/new"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#01696f] hover:bg-[#0c4e54] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#d4d1ca] p-12 text-center">
          <div className="w-12 h-12 bg-[#f3f0ec] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7a7974" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <h3 className="text-base font-medium text-[#28251d] mb-1">No courses yet</h3>
          <p className="text-sm text-[#7a7974] mb-4 max-w-xs mx-auto">
            Create your first course and start uploading lecture materials.
          </p>
          <Link href="/courses/new" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#01696f] text-white text-sm font-medium rounded-lg hover:bg-[#0c4e54] transition-colors">
            Create a course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="bg-white rounded-xl border border-[#d4d1ca] p-5 flex items-center justify-between hover:border-[#01696f] hover:shadow-sm transition-all group"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-semibold text-[#28251d] group-hover:text-[#01696f] transition-colors">
                    {course.name}
                  </span>
                  <span className="text-xs font-mono bg-[#f3f0ec] text-[#7a7974] px-2 py-0.5 rounded">
                    {course.code}
                  </span>
                </div>
                <p className="text-sm text-[#7a7974]">
                  {course.term} &middot; Join code:{' '}
                  <span className="font-mono font-medium text-[#28251d]">{course.join_code}</span>
                </p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-lg font-bold text-[#28251d] tabular-nums">
                  {enrollmentCounts[course.id] ?? 0}
                </p>
                <p className="text-xs text-[#7a7974]">students</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
