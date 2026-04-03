-- Migration 00015: notifications
CREATE TABLE public.notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       text NOT NULL CHECK (type IN
               ('GRADE_APPROVAL_NEEDED','GRADE_RELEASED','RANK_CHANGE','GENERAL')),
  title      text NOT NULL,
  body       text NOT NULL,
  deep_link  text,
  is_read    bool DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE INDEX notifications_user_unread_idx
  ON public.notifications(user_id, is_read)
  WHERE is_read = false;

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
