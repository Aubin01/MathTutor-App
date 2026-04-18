"""Request and response models used by the tutor API."""

from __future__ import annotations

from datetime import datetime
from typing import List, Literal

from pydantic import BaseModel, Field


Strictness = Literal["medium", "strict"]
MessageRole = Literal["student", "tutor", "system"]


class TutorMessage(BaseModel):
    id: str
    role: MessageRole
    content: str
    created_at: datetime


class TutorSession(BaseModel):
    id: str
    title: str
    problem: str
    strictness: Strictness
    max_hints: int
    revealed_count: int
    status: str
    created_at: datetime
    messages: List[TutorMessage]
    can_request_next: bool


class TutorSessionSummary(BaseModel):
    id: str
    title: str
    strictness: Strictness
    max_hints: int
    revealed_count: int
    status: str
    created_at: datetime


class CreateSessionRequest(BaseModel):
    problem: str = Field(min_length=2, max_length=8000)
    strictness: Strictness = "strict"
    max_hints: int = Field(default=5, ge=1, le=8)


class FollowUpRequest(BaseModel):
    message: str = Field(min_length=1, max_length=3000)


class ConfigResponse(BaseModel):
    default_strictness: Strictness
    default_max_hints: int
    hard_max_hints: int
    solver_model: str
    hint_model: str
    followup_model: str
