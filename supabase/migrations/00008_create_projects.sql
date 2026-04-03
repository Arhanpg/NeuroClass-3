-- Migration 00008: projects table
CREATE TABLE public.projects (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id         uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title             text NOT NULL,
  description       text,
  team_size         int NOT NULL,
  github_url        text,
  deadline          timestamptz NOT NULL,
  grade_weight_pct  numeric(5,2) NOT NULL,
  grading_status    text DEFAULT 'NOT_STARTED'
                         CHECK (grading_status IN ('NOT_STARTED','IN_PROGRESS','PENDING_APPROVAL','RELEASED')),
  created_at        timestamptz DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
