-- Migration: 00016_create_audit_log
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE TABLE IF NOT EXISTS public.audit_log (
  id         bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id   uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  action     text        NOT NULL,
  table_name text        NOT NULL,
  record_id  uuid,
  old_data   jsonb,
  new_data   jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_log_actor_id_idx ON public.audit_log(actor_id);
CREATE INDEX IF NOT EXISTS audit_log_table_idx    ON public.audit_log(table_name, record_id);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
