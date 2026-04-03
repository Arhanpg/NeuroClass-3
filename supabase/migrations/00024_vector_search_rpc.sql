-- Migration: 00024_vector_search_rpc
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE OR REPLACE FUNCTION public.match_lecture_chunks(
  query_embedding extensions.vector(1536),
  match_count      integer DEFAULT 5,
  filter_lecture   uuid    DEFAULT NULL
)
RETURNS TABLE (
  id          uuid,
  lecture_id  uuid,
  content     text,
  chunk_index integer,
  metadata    jsonb,
  similarity  float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    lc.id,
    lc.lecture_id,
    lc.content,
    lc.chunk_index,
    lc.metadata,
    1 - (lc.embedding <=> query_embedding) AS similarity
  FROM public.lecture_chunks lc
  WHERE
    (filter_lecture IS NULL OR lc.lecture_id = filter_lecture)
    AND lc.embedding IS NOT NULL
  ORDER BY lc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
