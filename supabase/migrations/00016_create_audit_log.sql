-- Migration: 00016_create_audit_log
-- Append-only audit log for grade and rubric changes

CREATE TABLE IF NOT EXISTS public.audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL
                CHECK (entity_type IN ('GRADE','RUBRIC','COURSE','USER')),
  entity_id   uuid NOT NULL,
  action      text NOT NULL
                CHECK (action IN ('CREATE','UPDATE','OVERRIDE','APPROVE','REJECT','DELETE')),
  actor_id    uuid REFERENCES public.profiles(id),
  old_value   jsonb,
  new_value   jsonb,
  timestamp   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
