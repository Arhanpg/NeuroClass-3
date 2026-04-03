-- Migration: 00022_rls_leaderboard

-- leaderboard_entries: SELECT — all authenticated users
CREATE POLICY "leaderboard_select" ON public.leaderboard_entries
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- leaderboard_entries: INSERT/UPDATE — service role only (AI agent)
-- Regular users cannot write to leaderboard; AI service uses service_role key
CREATE POLICY "leaderboard_insert" ON public.leaderboard_entries
  FOR INSERT WITH CHECK (false); -- blocked; service_role bypasses RLS

CREATE POLICY "leaderboard_update" ON public.leaderboard_entries
  FOR UPDATE USING (false); -- blocked; service_role bypasses RLS

-- projects: SELECT — enrolled + instructor + TA
CREATE POLICY "projects_select" ON public.projects
  FOR SELECT USING (
    public.is_enrolled(course_id)
    OR public.is_course_instructor(course_id)
    OR public.current_user_role() IN ('ADMIN','TEACHING_ASSISTANT')
  );

CREATE POLICY "projects_insert" ON public.projects
  FOR INSERT WITH CHECK (public.is_course_instructor(course_id));

-- teams: SELECT — team members + instructor/TA
CREATE POLICY "teams_select" ON public.teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = id AND tm.student_id = auth.uid()
    )
    OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
  );

-- team_members: SELECT — own row + instructor/TA
CREATE POLICY "team_members_select" ON public.team_members
  FOR SELECT USING (
    student_id = auth.uid()
    OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
  );

-- commit_logs: SELECT — team members + instructor/TA
CREATE POLICY "commit_logs_select" ON public.commit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_id AND tm.student_id = auth.uid()
    )
    OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
  );

-- langgraph_checkpoints: service role only
CREATE POLICY "checkpoints_select" ON public.langgraph_checkpoints
  FOR SELECT USING (public.current_user_role() = 'ADMIN');
