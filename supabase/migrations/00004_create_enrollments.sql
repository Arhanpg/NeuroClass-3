-- Migration: 00004_create_enrollments
-- Creates enrollments table linking students to courses

CREATE TABLE IF NOT EXISTS public.enrollments (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   uuid          NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id  uuid          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at   timestamptz   DEFAULT now(),
  UNIQUE(course_id, student_id)
);

-- Enable RLS
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON public.enrollments(student_id);
