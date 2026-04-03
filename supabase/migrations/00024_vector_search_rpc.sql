-- Migration: 00024_vector_search_rpc
-- RPC function for pgvector cosine similarity search used by AI Tutor RAG

CREATE OR REPLACE FUNCTION public.match_lecture_chunks(
  query_embedding  extensions.vector(1536),
  course_id_filter uuid,
  match_count      int DEFAULT 5
)
RETURNS TABLE (
  id          uuid,
  content     text,
  metadata    jsonb,
  similarity  float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    content,
    metadata,
    1 - (embedding <=> query_embedding) AS similarity
  FROM public.lecture_chunks
  WHERE course_id = course_id_filter
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Grant execute to authenticated users (Tutor agent calls this via service_role)
GRANT EXECUTE ON FUNCTION public.match_lecture_chunks TO authenticated;
GRANT EXECUTE ON FUNCTION public.match_lecture_chunks TO service_role;
