"""NeuroClass LangGraph State definition."""

from typing import TypedDict, Optional, List, Any


class NeuroClassState(TypedDict):
    """Shared state passed between all LangGraph nodes."""

    # Session identifiers
    thread_id: str
    student_id: str
    course_id: str

    # Input
    message: str
    attachments: List[str]

    # Intent classification (set by supervisor node)
    intent: Optional[str]  # DOUBT | PROJECT_QUERY | GRADE_INQUIRY | UNKNOWN

    # RAG results (set by tutor node)
    retrieved_chunks: List[dict]
    cited_sources: List[dict]

    # AI response (set by worker nodes)
    agent_response: Optional[str]
    agent_name: Optional[str]

    # Grading workflow fields
    project_id: Optional[str]
    team_id: Optional[str]
    rubric_id: Optional[str]
    submission_url: Optional[str]
    preliminary_scores: Optional[dict]
    evaluation_feedback: Optional[dict]
    evaluation_attempts: int
    final_scores: Optional[dict]
    normalized_score: Optional[float]
    letter_grade: Optional[str]
    feedback_summary: Optional[str]
    grading_trajectory: List[dict]

    # HiTL fields
    instructor_action: Optional[str]
    override_scores: Optional[dict]
    instructor_justification: Optional[str]

    # Metadata
    execution_start_ms: int
    error: Optional[str]
