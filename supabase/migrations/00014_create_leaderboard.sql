-- Migration: 00014_create_leaderboard
-- Realtime-enabled for animated updates

CREATE TABLE IF NOT EXISTS public.leaderboard_entries (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id       uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  team_id         uuid        NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  project_id      uuid        REFERENCES public.projects(id),
  total_score     float       NOT NULL DEFAULT 0,
  rank            integer,
  previous_rank   integer,
  badge           text,  -- 'GOLD' | 'SILVER' | 'BRONZE' | null
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE(course_id, team_id)
);

CREATE INDEX idx_leaderboard_course ON public.leaderboard_entries(course_id, total_score DESC);

-- Enable Realtime for live leaderboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard_entries;
