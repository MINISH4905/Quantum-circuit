from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    Index,
    Integer,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class UserRole(str, enum.Enum):
    USER = "user"
    INSTRUCTOR = "instructor"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    google_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(320), unique=True)
    name: Mapped[str] = mapped_column(String(256))
    picture: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole, native_enum=False), default=UserRole.USER)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    last_login: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    memberships: Mapped[list[GroupMembership]] = relationship(back_populates="user", cascade="all, delete-orphan")


class InstructorGroup(Base):
    __tablename__ = "instructor_groups"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(256))
    code: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    instructor_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    instructor: Mapped[User] = relationship(foreign_keys=[instructor_id])
    members: Mapped[list[GroupMembership]] = relationship(back_populates="group", cascade="all, delete-orphan")


class GroupMembership(Base):
    __tablename__ = "group_memberships"
    __table_args__ = (UniqueConstraint("user_id", "group_id"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    group_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("instructor_groups.id"))
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped[User] = relationship(back_populates="memberships")
    group: Mapped[InstructorGroup] = relationship(back_populates="members")


class AssessmentAttempt(Base):
    """One graded submission — a whole quiz, or a single coding challenge.

    Every attempt is kept rather than upserting a single best row: retries are
    allowed, so the history is what lets an instructor see effort as well as the
    final mark. "Best score" is derived in the query layer (see
    routers/assessments.py), not stored.

    `source_file` is the concept's GitHub path, which is the only globally
    unique concept identifier in the learning content — concept `id`s repeat
    both across and within modules. It matches the key the frontend's
    progress stores use.
    """

    __tablename__ = "assessment_attempts"
    __table_args__ = (Index("ix_assessment_attempts_user_source", "user_id", "source_file"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)

    source_file: Mapped[str] = mapped_column(String(512), index=True)
    concept_title: Mapped[str] = mapped_column(String(512), default="")

    # "quiz" | "challenge" — kept as a plain string so adding a kind later
    # needs no schema change.
    kind: Mapped[str] = mapped_column(String(32))
    challenge_id: Mapped[str | None] = mapped_column(String(128), nullable=True)

    score: Mapped[int] = mapped_column(Integer)
    max_score: Mapped[int] = mapped_column(Integer)
    passed: Mapped[bool] = mapped_column(Boolean, default=False)

    # Picked option keys for a quiz, submitted source for a challenge. JSON
    # works on both Postgres and SQLite, so tests can run on either.
    answers: Mapped[dict | list | None] = mapped_column(JSON, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped[User] = relationship()
