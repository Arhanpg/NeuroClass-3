import Link from 'next/link'

interface Enrollment {
  joined_at: string
  courses: {
    id: string
    name: string
    code: string
    term: string
    profiles: { full_name: string } | null
  } | null
}

interface StudentDashboardProps {
  profile: { full_name: string; role: string }
  enrollments: Enrollment[]
}

export function StudentDashboard({ profile, enrollments }: StudentDashboardProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#28251d]">
          Welcome, {profile.full_name.split(' ')[0]} 🎓
        </h1>
        <p className="text-sm text-[#7a7974] mt-1">
          Your enrolled courses and upcoming activities
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#d4d1ca] p-5">
          <p className="text-3xl font-bold text-[#28251d] tabular-nums">{enrollments.length}</p>
          <p className="text-sm text-[#7a7974] mt-1">Courses enrolled</p>
        </div>
        <div className="bg-white rounded-xl border border-[#d4d1ca] p-5">
          <p className="text-3xl font-bold text-[#28251d] tabular-nums">0</p>
          <p className="text-sm text-[#7a7974] mt-1">Pending quizzes</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#28251d]">My Courses</h2>
        <Link
          href="/courses/join"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#01696f] hover:bg-[#0c4e54] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Join a Course
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#d4d1ca] p-12 text-center">
          <div className="w-12 h-12 bg-[#f3f0ec] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7a7974" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <h3 className="text-base font-medium text-[#28251d] mb-1">Not enrolled in any course</h3>
          <p className="text-sm text-[#7a7974] mb-4 max-w-xs mx-auto">
            Ask your instructor for the join code to enroll in a course.
          </p>
          <Link href="/courses/join" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#01696f] text-white text-sm font-medium rounded-lg hover:bg-[#0c4e54] transition-colors">
            Join a course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {enrollments.map((enr) => {
            const c = enr.courses
            if (!c) return null
            return (
              <Link
                key={c.id}
                href={`/courses/${c.id}`}
                className="bg-white rounded-xl border border-[#d4d1ca] p-5 hover:border-[#01696f] hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-semibold text-[#28251d] group-hover:text-[#01696f] transition-colors">
                    {c.name}
                  </span>
                  <span className="text-xs font-mono bg-[#f3f0ec] text-[#7a7974] px-2 py-0.5 rounded">
                    {c.code}
                  </span>
                </div>
                <p className="text-sm text-[#7a7974]">
                  {c.term} &middot; {c.profiles?.full_name ?? 'Unknown instructor'}
                </p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
