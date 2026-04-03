"""NeuroClass AI Service — FastAPI entry point for Google Cloud Run."""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import logging
import os
import time

from config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="NeuroClass AI Service",
    description="LangGraph-powered AI orchestration for NeuroClass platform",
    version="0.1.0",
    docs_url="/docs" if settings.environment == "development" else None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://neuroclass.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["Authorization", "Content-Type", "X-Service-Secret"],
)


# ---- Auth dependency ----
async def verify_service_secret(x_service_secret: Optional[str] = Header(None)):
    """Validates the shared secret between Next.js and this service."""
    if settings.environment == "development":
        return  # Skip auth in local dev
    if not settings.ai_service_secret:
        return
    if x_service_secret != settings.ai_service_secret:
        raise HTTPException(status_code=401, detail="Invalid service secret")


# ---- Request / Response models ----
class InvokeRequest(BaseModel):
    thread_id: str
    student_id: str
    course_id: str
    message: str
    attachments: Optional[List[str]] = []


class InvokeResponse(BaseModel):
    response: str
    cited_sources: List[dict] = []
    agent_name: str = "tutor"
    execution_duration_ms: int


class IngestRequest(BaseModel):
    course_id: str
    lecture_id: str
    storage_path: str
    file_type: str  # PDF | MARKDOWN


class GradeRequest(BaseModel):
    project_id: str
    team_id: str
    rubric_id: str
    submission_url: str


class ResumeHitlRequest(BaseModel):
    grade_id: str
    instructor_action: str  # APPROVE | OVERRIDE | REJECT
    override_scores: Optional[dict] = None
    justification: Optional[str] = None


# ---- Routes ----
@app.get("/health")
async def health_check():
    """Cloud Run readiness + liveness probe."""
    return {"status": "ok", "service": "neuroclass-ai", "version": "0.1.0"}


@app.post("/invoke", response_model=InvokeResponse, dependencies=[Depends(verify_service_secret)])
async def invoke_agent(payload: InvokeRequest):
    """
    Main LangGraph invocation endpoint.
    Receives student query, runs graph, returns AI response.
    Phase 3 will wire in the actual LangGraph graph here.
    """
    start = time.time()
    logger.info(f"/invoke: thread={payload.thread_id} student={payload.student_id}")

    # TODO Phase 3: from graph.graph import run_graph; result = await run_graph(payload)
    # Placeholder response for Phase 0 smoke testing
    result = {
        "response": "NeuroClass AI Service is running. LangGraph will be wired in Phase 3.",
        "cited_sources": [],
        "agent_name": "placeholder",
        "execution_duration_ms": int((time.time() - start) * 1000),
    }
    return result


@app.post("/ingest", dependencies=[Depends(verify_service_secret)])
async def ingest_lecture(payload: IngestRequest):
    """
    Triggers RAG ingestion pipeline for a lecture file.
    Phase 2 will wire in the actual chunking + embedding pipeline.
    """
    logger.info(f"/ingest: course={payload.course_id} lecture={payload.lecture_id}")
    # TODO Phase 2: from rag.ingestion import run_ingestion; await run_ingestion(payload)
    return {"status": "queued", "lecture_id": payload.lecture_id}


@app.post("/grade", dependencies=[Depends(verify_service_secret)])
async def grade_submission(payload: GradeRequest):
    """
    Triggers automated grading workflow.
    Phase 5 will wire in the Evaluator-Optimizer LangGraph.
    """
    logger.info(f"/grade: project={payload.project_id} team={payload.team_id}")
    # TODO Phase 5: from graph.graph import run_grading_graph; await run_grading_graph(payload)
    return {"status": "queued", "project_id": payload.project_id}


@app.post("/resume-hitl", dependencies=[Depends(verify_service_secret)])
async def resume_hitl(payload: ResumeHitlRequest):
    """
    Resumes a paused LangGraph grading workflow after instructor HiTL review.
    Phase 5 will load from Supabase checkpointer and resume.
    """
    logger.info(f"/resume-hitl: grade={payload.grade_id} action={payload.instructor_action}")
    # TODO Phase 5: load from checkpointer and resume
    return {"status": "resumed", "grade_id": payload.grade_id}
