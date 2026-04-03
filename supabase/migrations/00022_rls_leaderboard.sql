-- Migration 00022: RLS for leaderboard_entries + notifications + commit_logs

-- leaderboard: all authenticated users can read
CREATE POLICY "leaderboard_select_authenticated" ON public.leaderboard_entries
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only service role (AI agent) inserts/updates leaderboard
CREATE POLICY "leaderboard_insert_service" ON public.leaderboard_entries
  FOR INSERT WITH CHECK (false);  -- blocked for regular users

CREATE POLICY "leaderboard_update_service" ON public.leaderboard_entries
  FOR UPDATE USING (false);  -- blocked for regular users

-- notifications: own user only
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- commit_logs: team members or staff
CREATE POLICY "commit_logs_select" ON public.commit_logs
  FOR SELECT USING (
    public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
    OR EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = commit_logs.team_id AND student_id = auth.uid()
    )
  );
