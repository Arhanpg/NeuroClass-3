-- Migration: 00014_create_leaderboard

CREATE TABLE IF NOT EXISTS public.leaderboard_entries (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id              uuid NOT NULL REFERENCES public.courses(id),
  team_id                uuid NOT NULL REFERENCES public.teams(id),
  team_name              text NOT NULL,
  rank                   int NOT NULL,
  overall_score          numeric(5,2) DEFAULT 0,
  sprint_completion_rate numeric(5,2) DEFAULT 0,
  milestone_adherence_pct numeric(5,2) DEFAULT 0,
  aggregate_pcs          numeric(5,2) DEFAULT 0,
  tutor_engagement_score numeric(5,2) DEFAULT 0,
  milestone_badge        text DEFAULT 'NONE'
                           CHECK (milestone_badge IN ('GOLD','SILVER','BRONZE','NONE')),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, team_id)
);

ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
