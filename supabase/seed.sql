-- Dev seed data for NeuroClass
-- Run after all migrations: supabase db seed
-- Note: auth.users must be created via Supabase Auth UI or signUp() first

-- Sample instructor profile (replace UUID with actual auth.users id)
-- INSERT INTO public.profiles (id, email, full_name, role) VALUES
--   ('00000000-0000-0000-0000-000000000001', 'instructor@test.com', 'Prof. Test', 'INSTRUCTOR');

-- Sample course
-- INSERT INTO public.courses (id, name, code, term, instructor_id, pedagogy_style) VALUES
--   ('00000000-0000-0000-0000-000000000010',
--    'Introduction to AI', 'CS-401', 'Spring 2026',
--    '00000000-0000-0000-0000-000000000001', 'SOCRATIC');

-- Sample student
-- INSERT INTO public.profiles (id, email, full_name, role) VALUES
--   ('00000000-0000-0000-0000-000000000002', 'student@test.com', 'Test Student', 'STUDENT');

-- Sample enrollment
-- INSERT INTO public.enrollments (course_id, student_id) VALUES
--   ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002');

SELECT 'Seed file ready. Uncomment rows after creating auth users.' AS status;
