-- Migration: 00015_create_notifications
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE TABLE IF NOT EXISTS public.notifications (
  id         uuid        PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       text        NOT NULL,
  title      text        NOT NULL,
  body       text,
  is_read    boolean     NOT NULL DEFAULT false,
  metadata   jsonb       NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx   ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx   ON public.notifications(user_id, is_read);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
