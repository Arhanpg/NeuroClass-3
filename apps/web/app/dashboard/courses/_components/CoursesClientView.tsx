'use client';

import { useCourses } from '@/lib/hooks/useCourses';
import { useAuth }   from '@/lib/hooks/useAuth';
import { CourseCard } from '@/components/courses/CourseCard';
import { Skeleton }   from '@/components/ui/skeleton';
import { Button }     from '@/components/ui/button';
import Link           from 'next/link';

export function CoursesClientView() {
  const { courses, loading, error, reload } = useCourses();
  const { role } = useAuth();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
        <p className="text-destructive font-medium">Failed to load courses</p>
        <p className="text-muted-foreground mt-1">{error}</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={reload}>
          Try again
        </Button>
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        <p className="text-base font-medium text-foreground">No courses yet</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          {role === 'INSTRUCTOR'
            ? 'Create your first course to get started.'
            : 'Ask your instructor for a join code to enroll in a course.'}
        </p>
        <div className="flex gap-2 mt-4">
          {role === 'INSTRUCTOR' ? (
            <Button asChild size="sm">
              <Link href="/dashboard/courses/new">Create Course</Link>
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link href="/dashboard/enroll">Join a Course</Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Separate active vs archived
  const active   = courses.filter((c) => !c.is_archived);
  const archived = courses.filter((c) =>  c.is_archived);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {active.map((course) => (
          <CourseCard key={course.id} course={course as never} role={role ?? 'STUDENT'} />
        ))}
      </div>

      {archived.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Archived</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
            {archived.map((course) => (
              <CourseCard key={course.id} course={course as never} role={role ?? 'STUDENT'} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
