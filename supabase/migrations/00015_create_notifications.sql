-- Migration: 00015_create_notifications

CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        text        NOT NULL,
  -- GRADE_RELEASED | HITL_NEEDED | RANK_CHANGE | TEAM_JOINED | SYSTEM
  title       text        NOT NULL,
  body        text        NOT NULL,
  metadata    jsonb       DEFAULT '{}',
  is_read     boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user    ON public.notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
