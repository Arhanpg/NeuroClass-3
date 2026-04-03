'use client';

import { useEffect, useState, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type Course = Database['public']['Tables']['courses']['Row'];

export function useCourses() {
  const supabase = createBrowserClient();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>('STUDENT');

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = profile?.role ?? 'STUDENT';
    setRole(userRole);

    if (['INSTRUCTOR', 'ADMIN', 'TEACHING_ASSISTANT'].includes(userRole)) {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false });
      setCourses(data ?? []);
    } else {
      const { data } = await supabase
        .from('enrollments')
        .select('courses(*)')
        .eq('student_id', user.id)
        .order('joined_at', { ascending: false });
      const enrolled = (data ?? []).map((e: any) => e.courses).filter(Boolean) as Course[];
      setCourses(enrolled);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const createCourse = async (payload: {
    name: string;
    code: string;
    term: string;
    enrollment_cap: number;
    pedagogy_style: string;
    pedagogy_custom?: string | null;
  }) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const joinCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const { data, error } = await supabase
      .from('courses')
      .insert({ ...payload, instructor_id: user.id, join_code: joinCode })
      .select()
      .single();

    if (error) throw error;
    setCourses((prev) => [data, ...prev]);
    return data;
  };

  const enrollByCode = async (joinCode: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, name, enrollment_cap')
      .eq('join_code', joinCode.trim().toUpperCase())
      .eq('is_archived', false)
      .single();

    if (courseError || !course) throw new Error('Invalid join code');

    const { error: enrollError } = await supabase
      .from('enrollments')
      .insert({ course_id: course.id, student_id: user.id });

    if (enrollError) throw enrollError;
    await fetchCourses();
    return course;
  };

  return { courses, loading, role, refetch: fetchCourses, createCourse, enrollByCode };
}
