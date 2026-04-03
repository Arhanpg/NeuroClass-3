-- Migration: 00001_enable_pgvector
-- Enables the pgvector extension for storing and querying vector embeddings.
-- Must be run first before any table with vector columns is created.

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Also enable useful Postgres extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA extensions;
