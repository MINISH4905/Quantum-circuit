from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..db.models import GroupMembership, InstructorGroup, User, UserRole
from ..db.session import get_db
from ..deps import get_current_user, require_role
from ..schemas import GroupDetail, GroupJoinRequest, MemberOut, MembershipOut

router = APIRouter(prefix="/api/groups", tags=["groups"])


@router.post("/join", status_code=status.HTTP_201_CREATED)
async def join_group(
    body: GroupJoinRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(InstructorGroup)
        .where(InstructorGroup.code == body.code)
        .options(selectinload(InstructorGroup.instructor))
    )
    group = result.scalar_one_or_none()
    if not group:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid group code")

    existing = await db.execute(
        select(GroupMembership).where(
            GroupMembership.user_id == user.id,
            GroupMembership.group_id == group.id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already a member")

    membership = GroupMembership(
        id=uuid.uuid4(),
        user_id=user.id,
        group_id=group.id,
    )
    db.add(membership)
    await db.commit()

    # group_code / instructor_name are here because the join confirmation in
    # src/pages/JoinGroupPage.tsx renders them.
    return {
        "detail": "Joined group",
        "group_id": str(group.id),
        "group_name": group.name,
        "group_code": group.code,
        "instructor_name": group.instructor.name,
    }


@router.delete("/leave/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
async def leave_group(
    group_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(GroupMembership).where(
            GroupMembership.user_id == user.id,
            GroupMembership.group_id == group_id,
        )
    )
    membership = result.scalar_one_or_none()
    if not membership:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not a member of this group")

    await db.delete(membership)
    await db.commit()


@router.get("/my", response_model=list[GroupDetail])
async def my_groups(
    user: User = Depends(require_role(UserRole.INSTRUCTOR, UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(InstructorGroup)
        .where(InstructorGroup.instructor_id == user.id)
        .options(selectinload(InstructorGroup.members).selectinload(GroupMembership.user))
    )
    groups = result.scalars().all()

    return [
        GroupDetail(
            id=g.id,
            name=g.name,
            code=g.code,
            members=[
                MemberOut(
                    id=m.user.id,
                    name=m.user.name,
                    email=m.user.email,
                    joined_at=m.joined_at,
                )
                for m in g.members
            ],
        )
        for g in groups
    ]


@router.get("/membership", response_model=list[MembershipOut])
async def my_memberships(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(GroupMembership)
        .where(GroupMembership.user_id == user.id)
        .options(selectinload(GroupMembership.group).selectinload(InstructorGroup.instructor))
    )
    memberships = result.scalars().all()

    return [
        MembershipOut(
            group_id=m.group.id,
            group_name=m.group.name,
            group_code=m.group.code,
            instructor_name=m.group.instructor.name,
            joined_at=m.joined_at,
        )
        for m in memberships
    ]
