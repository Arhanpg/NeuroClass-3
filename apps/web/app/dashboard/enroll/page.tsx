'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EnrollForm } from '@/components/courses/EnrollForm';
import { useCourses }  from '@/lib/hooks/useCourses';
import { useAuth }     from '@/lib/hooks/useAuth';

export default function EnrollPage() {
  const { enroll }   = useCourses();
  const { role }     = useAuth();
  const router       = useRouter();
  const [loading, setLoading] = useState(false);

  // Only students can enroll
  if (role && role === 'INSTRUCTOR') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
        <p className="text-base font-medium text-foreground">Not available</p>
        <p className="text-sm mt-1">
          Instructors create courses, not enroll in them. Go to
          <a href="/dashboard/courses/new" className="text-primary ml-1 hover:underline">
            Create Course
          </a>.
        </p>
      </div>
    );
  }

  const handleEnroll = async (joinCode: string) => {
    setLoading(true);
    try {
      await enroll(joinCode);
      setTimeout(() => router.push('/dashboard/courses'), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Join a Course</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Enter the join code provided by your instructor to enroll.
        </p>
      </div>
      <EnrollForm onEnroll={handleEnroll} loading={loading} />
    </div>
  );
}
