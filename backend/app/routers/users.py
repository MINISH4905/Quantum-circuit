from __future__ import annotations

import secrets
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..db.models import GroupMembership, InstructorGroup, User, UserRole
from ..db.session import get_db
from ..deps import get_current_user, require_role
from ..schemas import GroupCreateRequest, GroupOut, PaginatedUsers, RoleUpdateRequest, UserBrief, UserOut

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/users", response_model=PaginatedUsers)
async def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    role: str | None = None,
    search: str | None = None,
    _admin: User = Depends(require_role(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    query = select(User)

    if role:
        try:
            role_enum = UserRole(role)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")
        query = query.where(User.role == role_enum)

    if search:
        pattern = f"%{search}%"
        query = query.where(or_(User.name.ilike(pattern), User.email.ilike(pattern)))

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar()

    query = query.order_by(User.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    users = result.scalars().all()

    return PaginatedUsers(
        users=[UserOut.model_validate(u) for u in users],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.patch("/users/{user_id}/role")
async def update_user_role(
    user_id: uuid.UUID,
    body: RoleUpdateRequest,
    admin: User = Depends(require_role(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    if admin.id == user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot change your own role")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    try:
        new_role = UserRole(body.role)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")

    if new_role == UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot assign admin role")

    user.role = new_role
    await db.commit()
    return {"detail": "Role updated", "role": new_role.value}


@router.get("/groups", response_model=list[GroupOut])
async def list_groups(
    _admin: User = Depends(require_role(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    member_count_subq = (
        select(GroupMembership.group_id, func.count().label("cnt"))
        .group_by(GroupMembership.group_id)
        .subquery()
    )

    query = (
        select(InstructorGroup, func.coalesce(member_count_subq.c.cnt, 0).label("member_count"))
        .outerjoin(member_count_subq, InstructorGroup.id == member_count_subq.c.group_id)
        .options(selectinload(InstructorGroup.instructor))
    )

    result = await db.execute(query)
    rows = result.all()

    return [
        GroupOut(
            id=group.id,
            name=group.name,
            code=group.code,
            instructor=UserBrief.model_validate(group.instructor),
            member_count=count,
            created_at=group.created_at,
        )
        for group, count in rows
    ]


@router.post("/groups", response_model=GroupOut, status_code=status.HTTP_201_CREATED)
async def create_group(
    body: GroupCreateRequest,
    _admin: User = Depends(require_role(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == body.instructor_id))
    instructor = result.scalar_one_or_none()
    if not instructor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Instructor not found")
    if instructor.role != UserRole.INSTRUCTOR and instructor.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not an instructor")

    code = secrets.token_urlsafe(6)
    group = InstructorGroup(
        id=uuid.uuid4(),
        name=body.name,
        code=code,
        instructor_id=body.instructor_id,
    )
    db.add(group)
    await db.commit()
    await db.refresh(group, attribute_names=["instructor"])

    return GroupOut(
        id=group.id,
        name=group.name,
        code=group.code,
        instructor=UserBrief.model_validate(instructor),
        member_count=0,
        created_at=group.created_at,
    )


@router.delete("/groups/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_group(
    group_id: uuid.UUID,
    _admin: User = Depends(require_role(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(InstructorGroup).where(InstructorGroup.id == group_id))
    group = result.scalar_one_or_none()
    if not group:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")

    await db.delete(group)
    await db.commit()
