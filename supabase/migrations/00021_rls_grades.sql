-- Migration: 00021_rls_grades

ALTER TABLE public.grades          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.released_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rubrics         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commit_logs     ENABLE ROW LEVEL SECURITY;

-- GRADES (pending/HiTL): only instructor and service role
CREATE POLICY "grades: instructor read"
  ON public.grades FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects pr
      JOIN public.courses c ON c.id = pr.course_id
      WHERE pr.id = project_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "grades: instructor update"
  ON public.grades FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects pr
      JOIN public.courses c ON c.id = pr.course_id
      WHERE pr.id = project_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "grades: service full"
  ON public.grades USING (auth.role() = 'service_role');

-- RELEASED GRADES: students see their own team's grades
CREATE POLICY "released_grades: student own"
  ON public.released_grades FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "released_grades: instructor read"
  ON public.released_grades FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects pr
      JOIN public.courses c ON c.id = pr.course_id
      WHERE pr.id = project_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "released_grades: service full"
  ON public.released_grades USING (auth.role() = 'service_role');

-- RUBRICS: instructor full, enrolled student read
CREATE POLICY "rubrics: instructor full"
  ON public.rubrics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "rubrics: enrolled student read"
  ON public.rubrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.course_id = course_id AND e.student_id = auth.uid()
    )
  );
