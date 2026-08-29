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
