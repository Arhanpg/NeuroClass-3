'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchMyCourses,
  createCourse,
  enrollWithJoinCode,
  archiveCourse,
  updateCourse,
} from '@/lib/api/courses';
import type { Database } from '@/lib/supabase/types';

type CourseRow = Database['public']['Tables']['courses']['Row'];

/**
 * useCourses — manages the full lifecycle of courses for the current user.
 *
 * - Instructors: can addCourse, archiveCourse, editCourse
 * - Students: can enroll via join code
 * - Both: can reload
 */
export function useCourses() {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyCourses();
      setCourses(data as CourseRow[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addCourse = useCallback(async (
    payload: Parameters<typeof createCourse>[0]
  ) => {
    const course = await createCourse(payload);
    setCourses((prev) => [course, ...prev]);
    return course;
  }, []);

  const enroll = useCallback(async (joinCode: string) => {
    const course = await enrollWithJoinCode(joinCode);
    await load();
    return course;
  }, [load]);

  const archive = useCallback(async (courseId: string) => {
    await archiveCourse(courseId);
    setCourses((prev) =>
      prev.map((c) => c.id === courseId ? { ...c, is_archived: true } : c)
    );
  }, []);

  const edit = useCallback(async (
    courseId: string,
    payload: Parameters<typeof updateCourse>[1]
  ) => {
    const updated = await updateCourse(courseId, payload);
    setCourses((prev) =>
      prev.map((c) => c.id === courseId ? { ...c, ...updated } : c)
    );
    return updated;
  }, []);

  return { courses, loading, error, reload: load, addCourse, enroll, archive, edit };
}
