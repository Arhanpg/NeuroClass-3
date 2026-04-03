-- Migration: 00013_create_released_grades
-- Student-visible grades; only populated after instructor approval

CREATE TABLE IF NOT EXISTS public.released_grades (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_id              uuid NOT NULL UNIQUE REFERENCES public.grades(id),
  student_id            uuid NOT NULL REFERENCES public.profiles(id),
  project_id            uuid NOT NULL REFERENCES public.projects(id),
  normalized_score      numeric(5,2) NOT NULL,
  letter_grade          text NOT NULL,
  feedback_summary      text NOT NULL,
  show_detailed_criteria bool DEFAULT false,
  criteria_details      jsonb,
  instructor_approved_at timestamptz NOT NULL,
  released_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.released_grades ENABLE ROW LEVEL SECURITY;
