import { createServerClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { JoinCodeDisplay } from '@/components/courses/JoinCodeDisplay';

interface Props {
  params: { courseId: string };
}

const PEDAGOGY_LABELS: Record<string, string> = {
  DIRECT_INSTRUCTION: 'Direct Instruction',
  SOCRATIC: 'Socratic',
  GUIDED: 'Guided Discovery',
  FLIPPED: 'Flipped Classroom',
  CUSTOM: 'Custom',
};

export default async function CourseDetailPage({ params }: Props) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: course } = await supabase
    .from('courses')
    .select('*, profiles(full_name)')
    .eq('id', params.courseId)
    .single();

  if (!course) notFound();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role ?? 'STUDENT';
  const isInstructor = role === 'INSTRUCTOR' && course.instructor_id === user.id;

  const { count: enrolledCount } = await supabase
    .from('enrollments')
    .select('id', { count: 'exact', head: true })
    .eq('course_id', params.courseId);

  const navCards = [
    { label: 'Lectures', href: `lectures`, icon: '📄', desc: 'Upload and manage lecture notes' },
    { label: 'AI Tutor', href: `tutor`, icon: '🤖', desc: 'Ask questions about lectures' },
    { label: 'Projects', href: `projects`, icon: '💻', desc: 'Team projects and submissions' },
    { label: 'Leaderboard', href: `leaderboard`, icon: '🏆', desc: 'Class rankings and scores' },
    { label: 'Grades', href: `grades`, icon: '📊', desc: 'View your released grades' },
    ...(isInstructor
      ? [{ label: 'Rubrics', href: `rubrics`, icon: '📋', desc: 'Define grading rubrics' }]
      : []),
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                {course.code}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-medium">
                {PEDAGOGY_LABELS[course.pedagogy_style] ?? course.pedagogy_style}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {course.term} &bull; {enrolledCount ?? 0} student{enrolledCount !== 1 ? 's' : ''} enrolled
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Instructor:{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {(course as any).profiles?.full_name ?? 'Unknown'}
              </span>
            </p>
          </div>
          {isInstructor && (
            <JoinCodeDisplay joinCode={course.join_code} />
          )}
        </div>
      </div>

      {/* Nav cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {navCards.map((card) => (
          <Link
            key={card.label}
            href={`/dashboard/courses/${params.courseId}/${card.href}`}
            className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition-all"
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="font-semibold text-gray-900 dark:text-white text-sm">{card.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
