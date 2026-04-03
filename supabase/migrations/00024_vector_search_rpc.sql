-- Migration: 00024_vector_search_rpc
-- RPC function for pgvector cosine similarity search
-- Called by the Python RAG retrieval tool

CREATE OR REPLACE FUNCTION public.match_lecture_chunks(
  query_embedding  vector(1536),
  match_course_id  uuid,
  match_count      int DEFAULT 5,
  match_threshold  float DEFAULT 0.7
)
RETURNS TABLE (
  id          uuid,
  lecture_id  uuid,
  content     text,
  metadata    jsonb,
  similarity  float
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN QUERY
  SELECT
    lc.id,
    lc.lecture_id,
    lc.content,
    lc.metadata,
    1 - (lc.embedding <=> query_embedding) AS similarity
  FROM public.lecture_chunks lc
  WHERE
    lc.course_id = match_course_id
    AND lc.embedding IS NOT NULL
    AND 1 - (lc.embedding <=> query_embedding) > match_threshold
  ORDER BY lc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant execute to authenticated users and service role
GRANT EXECUTE ON FUNCTION public.match_lecture_chunks TO authenticated, service_role;
