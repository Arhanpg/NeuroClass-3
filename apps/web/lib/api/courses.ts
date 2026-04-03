import { createBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type Course = Database['public']['Tables']['courses']['Row'];
type CourseInsert = Database['public']['Tables']['courses']['Insert'];

const supabase = createBrowserClient();

/**
 * Fetch all courses for the current user (instructor or student).
 */
export async function getCourses(userId: string, role: string): Promise<Course[]> {
  if (['INSTRUCTOR', 'ADMIN', 'TEACHING_ASSISTANT'].includes(role)) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('instructor_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  } else {
    const { data, error } = await supabase
      .from('enrollments')
      .select('courses(*)')
      .eq('student_id', userId)
      .order('joined_at', { ascending: false });
    if (error) throw error;
    return ((data ?? []).map((e: any) => e.courses).filter(Boolean)) as Course[];
  }
}

/**
 * Get a single course by ID.
 */
export async function getCourse(courseId: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('*, profiles(full_name)')
    .eq('id', courseId)
    .single();
  if (error) return null;
  return data;
}

/**
 * Create a new course. Requires INSTRUCTOR role.
 */
export async function createCourse(
  payload: Omit<CourseInsert, 'id' | 'created_at'>
): Promise<Course> {
  const { data, error } = await supabase.from('courses').insert(payload).select().single();
  if (error) throw error;
  return data;
}

/**
 * Soft-archive a course.
 */
export async function archiveCourse(courseId: string): Promise<void> {
  const { error } = await supabase
    .from('courses')
    .update({ is_archived: true })
    .eq('id', courseId);
  if (error) throw error;
}
