-- NeuroClass development seed data
-- Run: supabase db seed
-- WARNING: Do not run in production

-- Insert test profiles (IDs are placeholders — replace with real auth.users IDs after sign-up)
-- INSERT INTO public.profiles (id, email, full_name, role)
-- VALUES
--   ('00000000-0000-0000-0000-000000000001', 'instructor@test.com', 'Dr. Test Instructor', 'instructor'),
--   ('00000000-0000-0000-0000-000000000002', 'student@test.com', 'Test Student', 'student');

-- Insert a sample course
-- INSERT INTO public.courses (id, title, description, instructor_id, join_code, pedagogy)
-- VALUES (
--   'cccccccc-0000-0000-0000-000000000001',
--   'Introduction to AI',
--   'Learn the fundamentals of artificial intelligence',
--   '00000000-0000-0000-0000-000000000001',
--   'AI2026',
--   'socratic'
-- );

SELECT 'Seed file loaded. Uncomment rows above and replace UUIDs with real auth user IDs.' AS note;
