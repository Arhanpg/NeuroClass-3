-- Migration: 00022_rls_leaderboard
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE POLICY "leaderboard_select"
  ON public.leaderboard FOR SELECT
  USING (
    public.is_enrolled(course_id)
    OR public.is_course_instructor(course_id)
    OR public.current_user_role() = 'ADMIN'
  );

CREATE POLICY "leaderboard_upsert"
  ON public.leaderboard FOR INSERT
  WITH CHECK (public.current_user_role() IN ('INSTRUCTOR','ADMIN'));

CREATE POLICY "leaderboard_update"
  ON public.leaderboard FOR UPDATE
  USING (public.current_user_role() IN ('INSTRUCTOR','ADMIN'));
