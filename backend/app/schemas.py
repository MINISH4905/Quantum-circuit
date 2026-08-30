from __future__ import annotations

import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class UserOut(BaseModel):
    id: uuid.UUID
    email: str
    name: str
    picture: str | None = None
    role: str
    created_at: datetime
    last_login: datetime
    model_config = {"from_attributes": True}


class UserBrief(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    model_config = {"from_attributes": True}


class GroupOut(BaseModel):
    id: uuid.UUID
    name: str
    code: str
    instructor: UserBrief
    member_count: int
    created_at: datetime


class MemberOut(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    joined_at: datetime


class GroupDetail(BaseModel):
    id: uuid.UUID
    name: str
    code: str
    members: list[MemberOut]


class GroupJoinRequest(BaseModel):
    code: str = Field(min_length=1, max_length=16)


class GroupCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=256)
    instructor_id: uuid.UUID


class RoleUpdateRequest(BaseModel):
    role: Literal["user", "instructor"]


class PaginatedUsers(BaseModel):
    users: list[UserOut]
    total: int
    page: int
    per_page: int


class MembershipOut(BaseModel):
    group_id: uuid.UUID
    group_name: str
    group_code: str
    instructor_name: str
    joined_at: datetime


class AuthUserOut(BaseModel):
    id: uuid.UUID
    email: str
    name: str
    picture: str | None = None
    role: str
    memberships: list[MembershipOut] = []


# --- Assessments ---------------------------------------------------------


class AttemptCreate(BaseModel):
    """A graded submission from the client.

    Grading happens client-side: the answer key lives only in the frontend's
    learning-content.json, so the server records the reported result rather than
    re-deriving it. That means a determined student could post a fabricated
    score — acceptable for a self-study tool, but it is why these numbers are
    "reported" progress, not exam-grade marks. Bounds below at least keep the
    stored data sane.
    """

    source_file: str = Field(min_length=1, max_length=512)
    concept_title: str = Field(default="", max_length=512)
    kind: Literal["quiz", "challenge"]
    challenge_id: str | None = Field(default=None, max_length=128)
    score: int = Field(ge=0, le=1000)
    max_score: int = Field(ge=0, le=1000)
    passed: bool = False
    answers: dict | list | None = None


class AttemptOut(BaseModel):
    id: uuid.UUID
    source_file: str
    concept_title: str
    kind: str
    challenge_id: str | None
    score: int
    max_score: int
    passed: bool
    created_at: datetime
    model_config = {"from_attributes": True}


class AssessmentSummary(BaseModel):
    """Best result per assessment for one learner."""

    source_file: str
    concept_title: str
    #: Best quiz mark. Both are 0 when the learner has only tried the
    #: coding challenges, which keeps such rows out of score averages.
    best_score: int
    max_score: int
    attempts: int
    challenges_passed: int = 0
    passed: bool
    last_attempt_at: datetime


class MemberProgress(BaseModel):
    user_id: uuid.UUID
    name: str
    email: str
    assessments_completed: int
    quizzes_attempted: int
    challenges_passed: int
    average_percent: float | None = None
    last_activity_at: datetime | None = None
