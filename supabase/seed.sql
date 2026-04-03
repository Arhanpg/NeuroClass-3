-- seed.sql — Development seed data for NeuroClass
-- Run: supabase db seed
-- NOTE: This requires auth.users to exist first (sign up via the app or supabase auth UI)

-- Insert test profiles (these reference auth.users which you must create via the dashboard)
-- Uncomment and fill in real UUIDs from auth.users after creating accounts:

/*
INSERT INTO public.profiles (id, email, full_name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'instructor@test.com', 'Dr. Rajesh Kumar', 'INSTRUCTOR'),
  ('00000000-0000-0000-0000-000000000002', 'student1@test.com', 'Arhan Ghosarwade', 'STUDENT'),
  ('00000000-0000-0000-0000-000000000003', 'student2@test.com', 'Priya Sharma', 'STUDENT')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.courses (name, code, term, instructor_id, join_code, pedagogy_style) VALUES
  ('Introduction to Computer Science', 'CS101', 'Spring 2026', '00000000-0000-0000-0000-000000000001', 'cs101abc', 'DIRECT_INSTRUCTION'),
  ('Data Structures & Algorithms', 'CS201', 'Spring 2026', '00000000-0000-0000-0000-000000000001', 'cs201def', 'SOCRATIC')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.enrollments (course_id, student_id)
SELECT c.id, '00000000-0000-0000-0000-000000000002'
FROM public.courses c WHERE c.code = 'CS101'
ON CONFLICT DO NOTHING;
*/

-- Safe placeholder so seed.sql is valid SQL
SELECT 'Seed file ready. Uncomment the insert blocks after creating test auth users.' AS info;
