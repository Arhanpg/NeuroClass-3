-- Migration: 00012_create_grades
-- Pending (HiTL queue) grades from AI grading pipeline

CREATE TABLE IF NOT EXISTS public.grades (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id        uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  team_id           uuid        NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  rubric_id         uuid        NOT NULL REFERENCES public.rubrics(id),
  ai_scores         jsonb       NOT NULL DEFAULT '{}',
  -- {criterion_name: {score, justification, confidence}}
  total_score       float,
  letter_grade      text,
  hitl_status       text        NOT NULL DEFAULT 'PENDING_REVIEW'
                                CHECK (hitl_status IN ('PENDING_REVIEW','APPROVED','OVERRIDDEN','REJECTED')),
  reviewer_id       uuid        REFERENCES public.profiles(id),
  reviewer_notes    text,
  override_scores   jsonb,
  final_scores      jsonb,
  ai_graph_trace    jsonb,  -- LangGraph node execution trace
  graded_at         timestamptz,
  reviewed_at       timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_grades_project     ON public.grades(project_id);
CREATE INDEX idx_grades_team        ON public.grades(team_id);
CREATE INDEX idx_grades_hitl_status ON public.grades(hitl_status);
