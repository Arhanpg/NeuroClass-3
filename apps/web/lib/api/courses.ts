import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type CourseInsert = Database['public']['Tables']['courses']['Insert'];
type CourseRow    = Database['public']['Tables']['courses']['Row'];

/**
 * Fetch all courses visible to the current user.
 * - INSTRUCTOR: courses they own
 * - STUDENT: courses they are enrolled in
 * - ADMIN/TA: all courses (RLS allows)
 */
export async function fetchMyCourses() {
  const sb = getSupabaseBrowserClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await sb
    .from('courses')
    .select(`
      *,
      enrollments(count),
      profiles!courses_instructor_id_fkey(full_name, avatar_url)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/**
 * Create a new course (INSTRUCTOR only — enforced by RLS).
 */
export async function createCourse(
  payload: Omit<CourseInsert, 'instructor_id' | 'id' | 'join_code' | 'created_at'>
) {
  const sb = getSupabaseBrowserClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await sb
    .from('courses')
    .insert({ ...payload, instructor_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data as CourseRow;
}

/**
 * Enroll the current student using a join code.
 * Validates: code exists, cap not reached, not already enrolled.
 */
export async function enrollWithJoinCode(joinCode: string) {
  const sb = getSupabaseBrowserClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: course, error: cErr } = await sb
    .from('courses')
    .select('id, name, enrollment_cap')
    .eq('join_code', joinCode.trim().toLowerCase())
    .single();

  if (cErr || !course) throw new Error('Invalid join code — course not found.');

  const { count } = await sb
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', course.id);

  if (count !== null && count >= (course.enrollment_cap ?? 200)) {
    throw new Error('This course has reached its enrollment limit.');
  }

  const { error: eErr } = await sb
    .from('enrollments')
    .insert({ course_id: course.id, student_id: user.id });

  if (eErr) {
    if (eErr.code === '23505') throw new Error('You are already enrolled in this course.');
    throw eErr;
  }

  return course;
}

/**
 * Fetch a single course by ID (with instructor profile and enrollment count).
 */
export async function getCourseById(courseId: string) {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb
    .from('courses')
    .select(`
      *,
      profiles!courses_instructor_id_fkey(full_name, avatar_url),
      enrollments(count)
    `)
    .eq('id', courseId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Soft-archive a course (INSTRUCTOR only — enforced by RLS).
 */
export async function archiveCourse(courseId: string) {
  const sb = getSupabaseBrowserClient();
  const { error } = await sb
    .from('courses')
    .update({ is_archived: true })
    .eq('id', courseId);
  if (error) throw error;
}

/**
 * Update course details (INSTRUCTOR only — enforced by RLS).
 */
export async function updateCourse(
  courseId: string,
  payload: Partial<Pick<CourseRow, 'name' | 'code' | 'term' | 'pedagogy_style' | 'pedagogy_custom' | 'enrollment_cap'>>
) {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb
    .from('courses')
    .update(payload)
    .eq('id', courseId)
    .select()
    .single();
  if (error) throw error;
  return data as CourseRow;
}
