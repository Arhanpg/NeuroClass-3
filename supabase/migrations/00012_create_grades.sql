-- Migration: 00012_create_grades
-- Pre-approval grade data (restricted to INSTRUCTOR/TA)

CREATE TABLE IF NOT EXISTS public.grades (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id               uuid NOT NULL REFERENCES public.projects(id),
  team_id                  uuid NOT NULL REFERENCES public.teams(id),
  rubric_id                uuid NOT NULL REFERENCES public.rubrics(id),
  submission_url           text,
  preliminary_scores       jsonb,
  evaluation_attempts      int DEFAULT 0,
  approval_status          text NOT NULL DEFAULT 'PENDING_AI'
                             CHECK (approval_status IN
                               ('PENDING_AI','PENDING_HITL','APPROVED','REJECTED')),
  hitl_timestamp           timestamptz,
  instructor_action        text,
  override_scores          jsonb,
  instructor_justification text,
  grading_trajectory       jsonb,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER grades_updated_at
  BEFORE UPDATE ON public.grades
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
