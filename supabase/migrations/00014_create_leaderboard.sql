-- Migration 00014: leaderboard_entries
CREATE TABLE public.leaderboard_entries (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id               uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  team_id                 uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  team_name               text NOT NULL,
  rank                    int,
  overall_score           numeric(5,2),
  sprint_completion_rate  numeric(5,2),
  milestone_adherence_pct numeric(5,2),
  aggregate_pcs           numeric(5,2),
  tutor_engagement_score  numeric(5,2),
  milestone_badge         text DEFAULT 'NONE'
                               CHECK (milestone_badge IN ('GOLD','SILVER','BRONZE','NONE')),
  updated_at              timestamptz DEFAULT now(),
  UNIQUE(course_id, team_id)
);

ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Enable Realtime for live leaderboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard_entries;
