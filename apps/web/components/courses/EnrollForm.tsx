'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';

export function EnrollForm() {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Find course by join code
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('id, name, enrollment_cap')
        .eq('join_code', joinCode.trim().toUpperCase())
        .eq('is_archived', false)
        .single();

      if (courseError || !course) {
        throw new Error('Invalid or expired join code. Please check with your instructor.');
      }

      // Check enrollment cap
      const { count } = await supabase
        .from('enrollments')
        .select('id', { count: 'exact', head: true })
        .eq('course_id', course.id);

      if (count !== null && course.enrollment_cap && count >= course.enrollment_cap) {
        throw new Error('This course has reached its enrollment limit.');
      }

      // Check if already enrolled
      const { data: existing } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', course.id)
        .eq('student_id', user.id)
        .single();

      if (existing) {
        throw new Error('You are already enrolled in this course.');
      }

      // Enroll
      const { error: enrollError } = await supabase
        .from('enrollments')
        .insert({ course_id: course.id, student_id: user.id });

      if (enrollError) throw enrollError;

      setSuccess(`Successfully enrolled in "${course.name}"!`);
      setTimeout(() => router.push(`/dashboard/courses/${course.id}`), 1500);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm px-4 py-3 rounded-lg border border-green-200 dark:border-green-800">
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Join Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="e.g. A1B2C3D4"
          maxLength={8}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Ask your instructor for the 8-character code.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || joinCode.length < 6}
        className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium text-sm transition-colors"
      >
        {loading ? 'Enrolling...' : 'Enroll Now'}
      </button>
    </form>
  );
}
