from __future__ import annotations

import uuid
from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.models import AssessmentAttempt, GroupMembership, InstructorGroup, User, UserRole
from ..db.session import get_db
from ..deps import get_current_user, require_role
from ..schemas import AssessmentSummary, AttemptCreate, AttemptOut, MemberProgress

router = APIRouter(prefix="/api/assessments", tags=["assessments"])


@router.post("/attempts", response_model=AttemptOut, status_code=status.HTTP_201_CREATED)
async def record_attempt(
    body: AttemptCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Record one graded submission for the signed-in learner.

    Attempts are append-only — retries accumulate rather than overwrite, so
    /progress can report both the best score and how many tries it took.
    """
    if body.score > body.max_score:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="score cannot exceed max_score",
        )

    attempt = AssessmentAttempt(
        id=uuid.uuid4(),
        user_id=user.id,
        source_file=body.source_file,
        concept_title=body.concept_title,
        kind=body.kind,
        challenge_id=body.challenge_id,
        score=body.score,
        max_score=body.max_score,
        passed=body.passed,
        answers=body.answers,
    )
    db.add(attempt)
    await db.commit()
    await db.refresh(attempt)
    return attempt


def _summarize(attempts: list[AssessmentAttempt]) -> list[AssessmentSummary]:
    """Collapse an attempt list into one best-result row per assessment.

    Quiz and challenge attempts are reported separately: a challenge is scored
    1/1, so folding it into `best_score` would read as a bogus quiz mark. An
    assessment with challenge attempts but no quiz gets max_score 0, which
    excludes it from score averages rather than counting as 100%.
    """
    by_source: dict[str, list[AssessmentAttempt]] = defaultdict(list)
    for a in attempts:
        by_source[a.source_file].append(a)

    summaries: list[AssessmentSummary] = []
    for source_file, group in by_source.items():
        quiz_attempts = [a for a in group if a.kind == "quiz"]
        best = (
            max(quiz_attempts, key=lambda a: (a.score / a.max_score if a.max_score else 0, a.created_at))
            if quiz_attempts
            else None
        )
        summaries.append(
            AssessmentSummary(
                source_file=source_file,
                concept_title=next((a.concept_title for a in group if a.concept_title), ""),
                best_score=best.score if best else 0,
                max_score=best.max_score if best else 0,
                attempts=len(quiz_attempts),
                challenges_passed=len(
                    {a.challenge_id for a in group if a.kind == "challenge" and a.passed and a.challenge_id}
                ),
                passed=any(a.passed for a in group),
                last_attempt_at=max(a.created_at for a in group),
            )
        )

    summaries.sort(key=lambda s: s.last_attempt_at, reverse=True)
    return summaries


@router.get("/progress", response_model=dict[str, list[AssessmentSummary]])
async def my_progress(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """The signed-in learner's own best score per assessment."""
    result = await db.execute(select(AssessmentAttempt).where(AssessmentAttempt.user_id == user.id))
    return {"assessments": _summarize(list(result.scalars().all()))}


@router.get("/groups/{group_id}/progress", response_model=dict[str, list[MemberProgress]])
async def group_progress(
    group_id: uuid.UUID,
    user: User = Depends(require_role(UserRole.INSTRUCTOR, UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    """Per-student progress for one group.

    Role alone is not enough — an instructor may only read groups they own, so
    ownership is checked explicitly. Admins may read any group.
    """
    group = (
        await db.execute(select(InstructorGroup).where(InstructorGroup.id == group_id))
    ).scalar_one_or_none()
    if not group:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")
    if user.role != UserRole.ADMIN and group.instructor_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your group")

    members = list(
        (
            await db.execute(
                select(User)
                .join(GroupMembership, GroupMembership.user_id == User.id)
                .where(GroupMembership.group_id == group_id)
                .order_by(User.name)
            )
        )
        .scalars()
        .all()
    )
    if not members:
        return {"members": []}

    member_ids = [m.id for m in members]
    attempts = list(
        (
            await db.execute(select(AssessmentAttempt).where(AssessmentAttempt.user_id.in_(member_ids)))
        )
        .scalars()
        .all()
    )

    by_user: dict[uuid.UUID, list[AssessmentAttempt]] = defaultdict(list)
    for a in attempts:
        by_user[a.user_id].append(a)

    rows: list[MemberProgress] = []
    for member in members:
        own = by_user.get(member.id, [])
        summaries = _summarize(own)
        quiz_summaries = [s for s in summaries if s.max_score > 0]
        average = (
            round(sum(s.best_score / s.max_score for s in quiz_summaries) / len(quiz_summaries) * 100, 1)
            if quiz_summaries
            else None
        )
        rows.append(
            MemberProgress(
                user_id=member.id,
                name=member.name,
                email=member.email,
                assessments_completed=sum(1 for s in summaries if s.passed),
                quizzes_attempted=len({a.source_file for a in own if a.kind == "quiz"}),
                challenges_passed=len(
                    {a.challenge_id for a in own if a.kind == "challenge" and a.passed and a.challenge_id}
                ),
                average_percent=average,
                last_activity_at=max((a.created_at for a in own), default=None),
            )
        )

    return {"members": rows}
