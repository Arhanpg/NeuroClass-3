-- Migration: 00008_create_projects

CREATE TABLE IF NOT EXISTS public.projects (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id        uuid NOT NULL REFERENCES public.courses(id),
  title            text NOT NULL,
  description      text,
  team_size        int NOT NULL,
  github_url       text,
  deadline         timestamptz NOT NULL,
  grade_weight_pct numeric(5,2) NOT NULL,
  grading_status   text NOT NULL DEFAULT 'NOT_STARTED'
                     CHECK (grading_status IN ('NOT_STARTED','IN_PROGRESS','PENDING_APPROVAL','RELEASED')),
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
