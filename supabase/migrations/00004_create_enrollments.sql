-- ============================================================
-- Migration: 00004_create_enrollments.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS public.enrollments (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   uuid          NOT NULL REFERENCES public.courses(id)  ON DELETE CASCADE,
  student_id  uuid          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at   timestamptz   DEFAULT now(),
  UNIQUE (course_id, student_id)
);

CREATE INDEX idx_enrollments_course   ON public.enrollments(course_id);
CREATE INDEX idx_enrollments_student  ON public.enrollments(student_id);
