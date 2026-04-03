-- Migration: 00004_create_enrollments
-- Creates the enrollments table linking students to courses.

CREATE TABLE IF NOT EXISTS public.enrollments (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   uuid        NOT NULL REFERENCES public.courses(id)  ON DELETE CASCADE,
  student_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at   timestamptz NOT NULL DEFAULT now(),

  -- Prevent a student from enrolling in the same course twice
  UNIQUE (course_id, student_id)
);

-- Enable RLS (policies are in migration 00019)
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Index: fast lookup of all courses a student is enrolled in
CREATE INDEX IF NOT EXISTS enrollments_student_id_idx ON public.enrollments (student_id);

-- Index: fast count of students in a course
CREATE INDEX IF NOT EXISTS enrollments_course_id_idx  ON public.enrollments (course_id);
