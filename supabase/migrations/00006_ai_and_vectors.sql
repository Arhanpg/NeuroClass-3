-- ============================================================
-- Migration 00006: AI Tables — Embeddings, Chat, AI Jobs
-- Requires pgvector (enabled in 00001)
-- ============================================================

-- --------------------------------------------------------
-- DOCUMENT EMBEDDINGS (RAG store)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.document_embeddings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
  source_type  TEXT NOT NULL CHECK (source_type IN ('resource', 'lesson', 'assignment', 'submission')),
  source_id    UUID NOT NULL,
  chunk_index  INTEGER NOT NULL DEFAULT 0,
  chunk_text   TEXT NOT NULL,
  embedding    extensions.vector(1536),   -- OpenAI text-embedding-3-small
  metadata     JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_embeddings_classroom ON public.document_embeddings(classroom_id);
-- IVFFlat index for ANN search (build after loading data)
-- CREATE INDEX idx_embeddings_vector ON public.document_embeddings
--   USING ivfflat (embedding extensions.vector_cosine_ops) WITH (lists = 100);

-- Helper: cosine similarity search
CREATE OR REPLACE FUNCTION public.match_documents(
  query_embedding extensions.vector(1536),
  match_threshold  FLOAT DEFAULT 0.7,
  match_count      INT   DEFAULT 5,
  p_classroom_id   UUID  DEFAULT NULL
)
RETURNS TABLE (
  id          UUID,
  chunk_text  TEXT,
  metadata    JSONB,
  similarity  FLOAT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    de.id,
    de.chunk_text,
    de.metadata,
    1 - (de.embedding <=> query_embedding) AS similarity
  FROM public.document_embeddings de
  WHERE
    (p_classroom_id IS NULL OR de.classroom_id = p_classroom_id)
    AND 1 - (de.embedding <=> query_embedding) > match_threshold
  ORDER BY de.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- --------------------------------------------------------
-- AI CHAT SESSIONS
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  classroom_id  UUID REFERENCES public.classrooms(id) ON DELETE SET NULL,
  title         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_sessions_user ON public.chat_sessions(user_id);

CREATE TRIGGER trg_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- --------------------------------------------------------
-- CHAT MESSAGES
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content     TEXT NOT NULL,
  metadata    JSONB DEFAULT '{}',    -- {sources, tokens_used, model}
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_session ON public.chat_messages(session_id);

-- --------------------------------------------------------
-- AI JOB QUEUE (grading, summarisation tasks)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_jobs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type      TEXT NOT NULL CHECK (job_type IN ('grade_submission', 'generate_quiz', 'summarise_lesson', 'embed_document', 'feedback')),
  payload       JSONB NOT NULL DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'done', 'failed')),
  result        JSONB,
  error         TEXT,
  retries       INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at    TIMESTAMPTZ,
  finished_at   TIMESTAMPTZ
);

CREATE INDEX idx_ai_jobs_status ON public.ai_jobs(status);
CREATE INDEX idx_ai_jobs_type   ON public.ai_jobs(job_type);
