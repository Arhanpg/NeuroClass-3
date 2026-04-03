-- Migration: 00004_create_enrollments
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE TABLE IF NOT EXISTS public.enrollments (
  id          uuid        PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  course_id   uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role        text        NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT','TEACHING_ASSISTANT')),
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, student_id)
);

CREATE INDEX IF NOT EXISTS enrollments_course_id_idx ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS enrollments_student_id_idx ON public.enrollments(student_id);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
