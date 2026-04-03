-- Migration: 00015_create_notifications

CREATE TABLE IF NOT EXISTS public.notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.profiles(id),
  type       text NOT NULL
               CHECK (type IN
                 ('GRADE_APPROVAL_NEEDED','GRADE_RELEASED','RANK_CHANGE','GENERAL')),
  title      text NOT NULL,
  body       text NOT NULL,
  deep_link  text,
  is_read    bool DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
