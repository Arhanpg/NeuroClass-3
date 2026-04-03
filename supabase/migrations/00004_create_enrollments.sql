-- Migration: 00004_create_enrollments

CREATE TABLE IF NOT EXISTS public.enrollments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id  uuid NOT NULL REFERENCES public.profiles(id),
  joined_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, student_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
