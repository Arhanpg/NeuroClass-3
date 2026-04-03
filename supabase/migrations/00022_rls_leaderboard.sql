-- Migration: 00022_rls_leaderboard

ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications       ENABLE ROW LEVEL SECURITY;

-- Leaderboard: all enrolled students in course can read
CREATE POLICY "leaderboard: enrolled read"
  ON public.leaderboard_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.course_id = course_id AND e.student_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "leaderboard: service full"
  ON public.leaderboard_entries USING (auth.role() = 'service_role');

-- Notifications: user sees own
CREATE POLICY "notifications: own read"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "notifications: own update"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "notifications: service full"
  ON public.notifications USING (auth.role() = 'service_role');
