import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CoursesClientView } from './_components/CoursesClientView';

export const metadata = { title: 'My Courses — NeuroClass' };

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Courses</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            View and manage your courses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/enroll">Join Course</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/courses/new">+ New Course</Link>
          </Button>
        </div>
      </div>

      {/* Course grid */}
      <Suspense fallback={<CoursesSkeleton />}>
        <CoursesClientView />
      </Suspense>
    </div>
  );
}

function CoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-48 rounded-xl" />
      ))}
    </div>
  );
}
