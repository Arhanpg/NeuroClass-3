-- Migration 00012: grades (pre-approval, restricted)
CREATE TABLE public.grades (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id               uuid NOT NULL REFERENCES public.projects(id),
  team_id                  uuid NOT NULL REFERENCES public.teams(id),
  rubric_id                uuid NOT NULL REFERENCES public.rubrics(id),
  submission_url           text,
  preliminary_scores       jsonb DEFAULT '{}',
  evaluation_attempts      int DEFAULT 0,
  approval_status          text DEFAULT 'PENDING_AI'
                                CHECK (approval_status IN
                                  ('PENDING_AI','PENDING_HITL','APPROVED','REJECTED')),
  hitl_timestamp           timestamptz,
  instructor_action        text CHECK (instructor_action IN ('APPROVE','OVERRIDE','REJECT')),
  override_scores          jsonb,
  instructor_justification text,
  grading_trajectory       jsonb DEFAULT '[]',
  created_at               timestamptz DEFAULT now(),
  updated_at               timestamptz DEFAULT now()
);

ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER grades_updated_at
  BEFORE UPDATE ON public.grades
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
