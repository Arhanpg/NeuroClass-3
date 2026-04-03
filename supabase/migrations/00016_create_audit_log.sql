-- Migration 00016: audit_log (append-only)
CREATE TABLE public.audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('GRADE','RUBRIC','COURSE','USER')),
  entity_id   uuid NOT NULL,
  action      text NOT NULL CHECK (action IN
                ('CREATE','UPDATE','OVERRIDE','APPROVE','REJECT','DELETE')),
  actor_id    uuid REFERENCES public.profiles(id),
  old_value   jsonb,
  new_value   jsonb,
  timestamp   timestamptz DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Append-only: prevent UPDATE/DELETE via trigger
CREATE OR REPLACE FUNCTION public.prevent_audit_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only';
END;
$$;

CREATE TRIGGER audit_log_no_update
  BEFORE UPDATE OR DELETE ON public.audit_log
  FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_mutation();
