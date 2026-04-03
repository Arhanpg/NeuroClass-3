import { createBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type Lecture = Database['public']['Tables']['lectures']['Row'];

const supabase = createBrowserClient();

/**
 * Fetch all lectures for a course.
 */
export async function getLectures(courseId: string): Promise<Lecture[]> {
  const { data, error } = await supabase
    .from('lectures')
    .select('*')
    .eq('course_id', courseId)
    .order('uploaded_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/**
 * Get a single lecture.
 */
export async function getLecture(lectureId: string): Promise<Lecture | null> {
  const { data, error } = await supabase
    .from('lectures')
    .select('*')
    .eq('id', lectureId)
    .single();
  if (error) return null;
  return data;
}

/**
 * Upload a lecture file and create the DB record.
 * Returns the created lecture and Supabase Storage path.
 */
export async function uploadLecture(
  courseId: string,
  file: File,
  userId: string
): Promise<{ lecture: Lecture; storagePath: string }> {
  const fileType = file.name.endsWith('.md') ? 'MARKDOWN' : 'PDF';
  const storagePath = `${courseId}/${Date.now()}_${file.name}`;

  const { error: storageError } = await supabase.storage
    .from('lecture-notes')
    .upload(storagePath, file, { upsert: false });

  if (storageError) throw storageError;

  const { data: lecture, error: insertError } = await supabase
    .from('lectures')
    .insert({
      course_id: courseId,
      title: file.name.replace(/\.[^.]+$/, ''),
      storage_path: storagePath,
      file_type: fileType,
      embedding_status: 'PENDING',
    })
    .select()
    .single();

  if (insertError) throw insertError;
  return { lecture, storagePath };
}

/**
 * Trigger RAG ingestion via Next.js API route.
 */
export async function triggerIngestion(
  courseId: string,
  lectureId: string,
  storagePath: string,
  fileType: string
): Promise<void> {
  const res = await fetch(`/api/courses/${courseId}/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lecture_id: lectureId, storage_path: storagePath, file_type: fileType }),
  });
  if (!res.ok) {
    console.warn('Ingestion trigger returned non-OK:', res.status);
  }
}
