'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CourseForm } from '@/components/courses/CourseForm';
import { useCourses }  from '@/lib/hooks/useCourses';
import { useAuth }     from '@/lib/hooks/useAuth';
import { JoinCodeDisplay } from '@/components/courses/JoinCodeDisplay';
import type { Course } from '@/lib/supabase/types';

export default function NewCoursePage() {
  const router   = useRouter();
  const { addCourse } = useCourses();
  const { role, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated]       = useState<Course | null>(null);

  // Guard — only instructors can create courses
  if (!authLoading && role && role !== 'INSTRUCTOR') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
        <p className="text-base font-medium text-foreground">Access denied</p>
        <p className="text-sm mt-1">Only instructors can create courses.</p>
      </div>
    );
  }

  const handleSubmit = async (data: Parameters<typeof addCourse>[0]) => {
    setSubmitting(true);
    try {
      const course = await addCourse(data);
      setCreated(course);
    } finally {
      setSubmitting(false);
    }
  };

  // Success state — show join code before navigating
  if (created) {
    return (
      <div className="max-w-md space-y-6">
        <div className="rounded-xl border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <p className="font-semibold text-green-800 dark:text-green-300">Course created!</p>
          </div>
          <div>
            <p className="text-sm font-medium">{created.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{created.code} &middot; {created.term}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Share this join code with your students:</p>
            <JoinCodeDisplay joinCode={created.join_code} />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/dashboard/courses/${created.id}`)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Open course &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create New Course</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          A unique join code will be generated automatically for student enrollment.
        </p>
      </div>
      <CourseForm onSubmit={handleSubmit} loading={submitting} />
    </div>
  );
}
