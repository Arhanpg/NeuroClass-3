'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCourseById, archiveCourse } from '@/lib/api/courses';
import { useAuth }          from '@/lib/hooks/useAuth';
import { JoinCodeDisplay }  from '@/components/courses/JoinCodeDisplay';
import { Badge }            from '@/components/ui/badge';
import { Button }           from '@/components/ui/button';
import { Skeleton }         from '@/components/ui/skeleton';
import type { Course } from '@/lib/supabase/types';

type CourseWithMeta = Course & {
  profiles?: { full_name: string; avatar_url: string | null } | null;
  enrollments?: { count: number }[];
};

const PEDAGOGY_LABELS: Record<string, string> = {
  SOCRATIC: 'Socratic',
  DIRECT:   'Direct Instruction',
  GUIDED:   'Guided Discovery',
  FLIPPED:  'Flipped Classroom',
  CUSTOM:   'Custom',
};

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { role }     = useAuth();
  const router       = useRouter();

  const [course,   setCourse]   = useState<CourseWithMeta | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    getCourseById(courseId)
      .then((data) => setCourse(data as CourseWithMeta))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleArchive = async () => {
    if (!course || !window.confirm('Archive this course? Students will no longer see it.')) return;
    setArchiving(true);
    try {
      await archiveCourse(course.id);
      router.push('/dashboard/courses');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to archive');
    } finally {
      setArchiving(false);
    }
  };

  if (loading) return <Skeleton className="h-64 w-full rounded-xl" />;
  if (error)   return <p className="text-sm text-destructive">{error}</p>;
  if (!course) return null;

  const enrollCount = course.enrollments?.[0]?.count ?? 0;
  const isInstructor = role === 'INSTRUCTOR';

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Title block */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
          {course.code} &middot; {course.term}
        </p>
        <h1 className="text-2xl font-semibold mt-1">{course.name}</h1>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline">
            {PEDAGOGY_LABELS[course.pedagogy_style] ?? course.pedagogy_style}
          </Badge>
          {course.is_archived && <Badge variant="secondary">Archived</Badge>}
        </div>
      </div>

      {/* Join code panel — instructor only */}
      {isInstructor && !course.is_archived && (
        <div className="rounded-xl border border-border bg-muted/40 p-5 space-y-3">
          <div>
            <p className="text-sm font-semibold">Student Join Code</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Share this code so students can enroll.
            </p>
          </div>
          <JoinCodeDisplay joinCode={course.join_code} />
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Instructor', value: course.profiles?.full_name ?? '—' },
          { label: 'Enrolled',   value: `${enrollCount} / ${course.enrollment_cap}` },
          { label: 'Term',       value: course.term },
          { label: 'Pedagogy',   value: PEDAGOGY_LABELS[course.pedagogy_style] ?? course.pedagogy_style },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-3 space-y-0.5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* Custom pedagogy note */}
      {course.pedagogy_style === 'CUSTOM' && course.pedagogy_custom && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Custom Pedagogy Description</p>
          <p className="text-sm">{course.pedagogy_custom}</p>
        </div>
      )}

      {/* Quick nav links */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Button variant="outline" size="sm" asChild>
          <a href={`/dashboard/lectures?courseId=${course.id}`}>Lectures</a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={`/dashboard/projects?courseId=${course.id}`}>Projects</a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={`/dashboard/tutor?courseId=${course.id}`}>AI Tutor</a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={`/dashboard/leaderboard?courseId=${course.id}`}>Leaderboard</a>
        </Button>
      </div>

      {/* Danger zone — instructor only */}
      {isInstructor && !course.is_archived && (
        <div className="rounded-xl border border-destructive/30 p-4 space-y-2">
          <p className="text-sm font-semibold text-destructive">Danger Zone</p>
          <p className="text-xs text-muted-foreground">
            Archiving hides the course from students and disables new enrollments.
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleArchive}
            disabled={archiving}
          >
            {archiving ? 'Archiving…' : 'Archive Course'}
          </Button>
        </div>
      )}
    </div>
  );
}
