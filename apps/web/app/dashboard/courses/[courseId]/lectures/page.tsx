import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LectureCard } from '@/components/lectures/LectureCard';
import { LectureUploader } from '@/components/lectures/LectureUploader';

interface Props {
  params: { courseId: string };
}

export default async function LecturesPage({ params }: Props) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role ?? 'STUDENT';
  const isInstructor = role === 'INSTRUCTOR' || role === 'TEACHING_ASSISTANT';

  const { data: lectures } = await supabase
    .from('lectures')
    .select('*')
    .eq('course_id', params.courseId)
    .order('uploaded_at', { ascending: false });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lecture Notes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isInstructor ? 'Upload PDF or Markdown files to power the AI Tutor.' : 'Course materials and readings.'}
          </p>
        </div>
      </div>

      {isInstructor && (
        <div className="mb-8">
          <LectureUploader courseId={params.courseId} />
        </div>
      )}

      <div className="space-y-3">
        {(lectures ?? []).length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📄</div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">No lectures uploaded yet</h3>
            {isInstructor && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upload your first lecture note above.
              </p>
            )}
          </div>
        ) : (
          (lectures ?? []).map((lecture) => (
            <LectureCard key={lecture.id} lecture={lecture} />
          ))
        )}
      </div>
    </div>
  );
}
