-- Migration: 00013_create_released_grades
-- Student-visible grades (only populated after instructor approval)

CREATE TABLE IF NOT EXISTS public.released_grades (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_id      uuid        NOT NULL UNIQUE REFERENCES public.grades(id),
  project_id    uuid        NOT NULL REFERENCES public.projects(id),
  team_id       uuid        NOT NULL REFERENCES public.teams(id),
  student_id    uuid        NOT NULL REFERENCES public.profiles(id),
  total_score   float       NOT NULL,
  letter_grade  text        NOT NULL,
  final_scores  jsonb       NOT NULL DEFAULT '{}',
  feedback      text,
  released_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_released_grades_student  ON public.released_grades(student_id);
CREATE INDEX idx_released_grades_project  ON public.released_grades(project_id);
