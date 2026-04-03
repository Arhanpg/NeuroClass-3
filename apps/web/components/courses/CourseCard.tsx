'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import type { Course } from '@/lib/supabase/types';

type CourseWithMeta = Course & {
  profiles?: { full_name: string; avatar_url: string | null } | null;
  enrollments?: { count: number }[];
};

interface CourseCardProps {
  course: CourseWithMeta;
  role: string;
}

const PEDAGOGY_LABELS: Record<string, string> = {
  SOCRATIC: 'Socratic',
  DIRECT:   'Direct Instruction',
  GUIDED:   'Guided Discovery',
  FLIPPED:  'Flipped Classroom',
  CUSTOM:   'Custom',
};

export function CourseCard({ course, role }: CourseCardProps) {
  const enrollCount = course.enrollments?.[0]?.count ?? 0;

  return (
    <Card className="group flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground truncate">
              {course.code} &middot; {course.term}
            </p>
            <h3 className="text-base font-semibold leading-snug mt-0.5 line-clamp-2">
              {course.name}
            </h3>
          </div>
          {course.is_archived && (
            <Badge variant="secondary" className="shrink-0 text-xs">Archived</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3 flex-1 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="text-xs">
            {PEDAGOGY_LABELS[course.pedagogy_style] ?? course.pedagogy_style}
          </Badge>
          {role === 'INSTRUCTOR' && (
            <Badge variant="outline" className="text-xs font-mono">
              Code: {course.join_code}
            </Badge>
          )}
        </div>

        {role === 'INSTRUCTOR' && (
          <p className="text-xs text-muted-foreground">
            {enrollCount} / {course.enrollment_cap} students enrolled
          </p>
        )}
        {role !== 'INSTRUCTOR' && course.profiles && (
          <p className="text-xs text-muted-foreground">
            Instructor: {course.profiles.full_name}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Link
          href={`/dashboard/courses/${course.id}`}
          className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          Open course &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
}
