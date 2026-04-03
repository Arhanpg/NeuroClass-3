-- Migration: 00023_rls_storage
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

-- Storage buckets are created via Supabase Dashboard or CLI storage commands.
-- This migration documents the intended RLS policies for storage objects.

-- Bucket: lecture-videos (private)
-- Bucket: course-banners (public)
-- Bucket: project-submissions (private)
-- Bucket: profile-avatars (public)

-- Placeholder: actual storage policies are applied via the Supabase dashboard
-- under Storage > Policies for each bucket.
SELECT 1; -- no-op to satisfy migration runner
