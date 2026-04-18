"""FastAPI entry point for the math tutor backend."""

from __future__ import annotations

from datetime import datetime
from typing import Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from . import settings
from .schemas import (
    ConfigResponse,
    CreateSessionRequest,
    FollowUpRequest,
    TutorMessage,
    TutorSession,
    TutorSessionSummary,
)
from .storage import SessionStore
from .tutor_engine import TutorEngine


app = FastAPI(title="Tutor App API")
store = SessionStore()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=settings.ALLOWED_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/api/config", response_model=ConfigResponse)
def get_config() -> ConfigResponse:
    return ConfigResponse(
        default_strictness=settings.DEFAULT_STRICTNESS,
        default_max_hints=settings.DEFAULT_MAX_HINTS,
        hard_max_hints=settings.HARD_MAX_HINTS,
        solver_model=settings.SOLVER_MODEL,
        hint_model=settings.HINT_MODEL,
        followup_model=settings.FOLLOWUP_MODEL,
    )


@app.get("/api/sessions", response_model=List[TutorSessionSummary])
def list_sessions() -> List[TutorSessionSummary]:
    return [to_summary(session) for session in store.all()]


@app.get("/api/sessions/{session_id}", response_model=TutorSession)
def get_session(session_id: str) -> TutorSession:
    session = store.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return to_public_session(session)


@app.delete("/api/sessions/{session_id}")
def delete_session(session_id: str) -> Dict[str, bool]:
    deleted = store.delete(session_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"deleted": True}


@app.post("/api/sessions", response_model=TutorSession)
def create_session(payload: CreateSessionRequest) -> TutorSession:
    try:
        engine = TutorEngine(store)
        session = engine.create_session(
            problem=payload.problem.strip(),
            strictness=payload.strictness,
            max_hints=payload.max_hints,
        )
        return to_public_session(session)
    except RuntimeError as error:
        raise HTTPException(status_code=500, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Tutor generation failed: {error}") from error


@app.post("/api/sessions/{session_id}/next-hint", response_model=TutorSession)
def next_hint(session_id: str) -> TutorSession:
    session = store.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    engine = TutorEngine(store)
    return to_public_session(engine.reveal_next_hint(session))


@app.post("/api/sessions/{session_id}/follow-up", response_model=TutorSession)
def follow_up(session_id: str, payload: FollowUpRequest) -> TutorSession:
    session = store.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    engine = TutorEngine(store)
    return to_public_session(engine.answer_follow_up(session, payload.message.strip()))


def to_summary(session: dict) -> TutorSessionSummary:
    return TutorSessionSummary(
        id=session["id"],
        title=session["title"],
        strictness=session["strictness"],
        max_hints=session["max_hints"],
        revealed_count=session["revealed_count"],
        status=session["status"],
        created_at=datetime.fromisoformat(session["created_at"]),
    )


def to_public_session(session: dict) -> TutorSession:
    messages = [
        TutorMessage(
            id=message["id"],
            role=message["role"],
            content=message["content"],
            created_at=datetime.fromisoformat(message["created_at"]),
        )
        for message in session["messages"]
    ]
    return TutorSession(
        id=session["id"],
        title=session["title"],
        problem=session["problem"],
        strictness=session["strictness"],
        max_hints=session["max_hints"],
        revealed_count=session["revealed_count"],
        status=session["status"],
        created_at=datetime.fromisoformat(session["created_at"]),
        messages=messages,
        can_request_next=session["revealed_count"] < len(session["hints"]),
    )
