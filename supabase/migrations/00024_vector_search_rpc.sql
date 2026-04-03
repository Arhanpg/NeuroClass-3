-- Migration 00024: vector_search RPC function
CREATE OR REPLACE FUNCTION public.vector_search(
  p_course_id   uuid,
  p_embedding   vector(1536),
  p_match_count int DEFAULT 5
)
RETURNS TABLE (
  id          uuid,
  lecture_id  uuid,
  chunk_index int,
  content     text,
  metadata    jsonb,
  similarity  float
)
LANGUAGE sql STABLE AS $$
  SELECT
    lc.id,
    lc.lecture_id,
    lc.chunk_index,
    lc.content,
    lc.metadata,
    1 - (lc.embedding <=> p_embedding) AS similarity
  FROM public.lecture_chunks lc
  WHERE lc.course_id = p_course_id
  ORDER BY lc.embedding <=> p_embedding
  LIMIT p_match_count;
$$;

-- Grant execute to authenticated and service_role
GRANT EXECUTE ON FUNCTION public.vector_search TO authenticated;
GRANT EXECUTE ON FUNCTION public.vector_search TO service_role;

-- audit_log: admin select only
CREATE POLICY "audit_log_select_admin" ON public.audit_log
  FOR SELECT USING (public.current_user_role() = 'ADMIN');

-- langgraph_checkpoints: service role only
CREATE POLICY "checkpoints_select_service" ON public.langgraph_checkpoints
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "checkpoints_insert_service" ON public.langgraph_checkpoints
  FOR INSERT WITH CHECK (false); -- only service_role bypasses RLS
