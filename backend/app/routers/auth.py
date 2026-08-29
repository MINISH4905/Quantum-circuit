from __future__ import annotations

import secrets
import uuid
from datetime import datetime, timezone
from urllib.parse import urlencode

import httpx
from authlib.jose import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..config import get_settings
from ..db.models import GroupMembership, InstructorGroup, User, UserRole
from ..db.session import get_db
from ..deps import get_current_user
from ..schemas import AuthUserOut, MembershipOut

router = APIRouter(tags=["auth"])

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"
GOOGLE_CERTS_URL = "https://www.googleapis.com/oauth2/v3/certs"


@router.get("/auth/google/login")
async def google_login(request: Request):
    settings = get_settings()
    state = secrets.token_urlsafe(32)
    request.state.session["oauth_state"] = state
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "scope": "openid email profile",
        "response_type": "code",
        "state": state,
        "access_type": "offline",
        "prompt": "consent",
    }
    url = f"{GOOGLE_AUTH_URL}?{urlencode(params)}"
    return RedirectResponse(url=url)


@router.get("/auth/google/callback")
async def google_callback(
    request: Request,
    code: str = "",
    state: str = "",
    db: AsyncSession = Depends(get_db),
):
    settings = get_settings()
    session = request.state.session

    saved_state = session.get("oauth_state")
    if not saved_state or saved_state != state:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OAuth state")

    del session["oauth_state"]

    if not code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing authorization code")

    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )

    if token_resp.status_code != 200:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token exchange failed")

    token_data = token_resp.json()
    access_token = token_data.get("access_token")

    async with httpx.AsyncClient() as client:
        userinfo_resp = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
        )

    if userinfo_resp.status_code != 200:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to fetch user info")

    userinfo = userinfo_resp.json()
    google_id = userinfo["sub"]
    email = userinfo["email"]
    name = userinfo.get("name", email)
    picture = userinfo.get("picture")

    result = await db.execute(select(User).where(User.google_id == google_id))
    user = result.scalar_one_or_none()

    if user is None:
        count_result = await db.execute(select(func.count()).select_from(User))
        user_count = count_result.scalar()
        role = UserRole.ADMIN if user_count == 0 else UserRole.USER

        user = User(
            id=uuid.uuid4(),
            google_id=google_id,
            email=email,
            name=name,
            picture=picture,
            role=role,
        )
        db.add(user)
    else:
        user.name = name
        user.picture = picture
        user.last_login = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(user)

    session["user_id"] = str(user.id)

    return RedirectResponse(url=settings.FRONTEND_URL, status_code=302)


@router.get("/auth/me")
async def auth_me(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(GroupMembership)
        .where(GroupMembership.user_id == user.id)
        .options(selectinload(GroupMembership.group).selectinload(InstructorGroup.instructor))
    )
    memberships_rows = result.scalars().all()

    memberships = [
        MembershipOut(
            group_id=m.group.id,
            group_name=m.group.name,
            group_code=m.group.code,
            instructor_name=m.group.instructor.name,
            joined_at=m.joined_at,
        )
        for m in memberships_rows
    ]

    return AuthUserOut(
        id=user.id,
        email=user.email,
        name=user.name,
        picture=user.picture,
        role=user.role.value,
        memberships=memberships,
    )


@router.post("/auth/logout")
async def logout(request: Request):
    session = request.state.session
    session.clear()
    return JSONResponse({"detail": "Logged out"})
