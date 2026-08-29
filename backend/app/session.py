from __future__ import annotations

import json
import uuid

from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from starlette.requests import Request
from starlette.types import ASGIApp, Receive, Scope, Send

from .redis import get_redis


class SessionData(dict):
    modified: bool = False

    def __setitem__(self, key, value):
        self.modified = True
        super().__setitem__(key, value)

    def __delitem__(self, key):
        self.modified = True
        super().__delitem__(key)

    def clear(self):
        self.modified = True
        super().clear()


class RedisSessionMiddleware:
    def __init__(
        self,
        app: ASGIApp,
        secret: str,
        cookie_name: str = "qlsession",
        max_age: int = 604800,
        secure: bool = False,
    ) -> None:
        self.app = app
        self.signer = URLSafeTimedSerializer(secret)
        self.cookie_name = cookie_name
        self.max_age = max_age
        self.secure = secure

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] not in ("http", "websocket"):
            await self.app(scope, receive, send)
            return

        request = Request(scope)
        session_id = self._read_cookie(request)
        session = SessionData()
        is_new = session_id is None

        if session_id:
            r = get_redis()
            raw = await r.get(f"session:{session_id}")
            if raw:
                session.update(json.loads(raw))
            else:
                session_id = None
                is_new = True

        scope["state"] = getattr(scope, "state", {}) if isinstance(scope.get("state"), dict) else {}
        scope["state"]["session"] = session
        scope["state"]["session_id"] = session_id

        async def send_wrapper(message):
            if message["type"] == "http.response.start":
                if session.modified or (is_new and len(session) > 0):
                    r = get_redis()
                    sid = session_id or uuid.uuid4().hex
                    await r.setex(f"session:{sid}", self.max_age, json.dumps(dict(session)))
                    cookie_val = self.signer.dumps(sid)
                    cookie = (
                        f"{self.cookie_name}={cookie_val}; Path=/; HttpOnly; "
                        f"SameSite=Lax; Max-Age={self.max_age}"
                    )
                    if self.secure:
                        cookie += "; Secure"
                    headers = list(message.get("headers", []))
                    headers.append((b"set-cookie", cookie.encode()))
                    message["headers"] = headers
                elif session_id and len(session) == 0 and session.modified:
                    r = get_redis()
                    await r.delete(f"session:{session_id}")
                    clear_cookie = (
                        f"{self.cookie_name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
                    )
                    if self.secure:
                        clear_cookie += "; Secure"
                    headers = list(message.get("headers", []))
                    headers.append((b"set-cookie", clear_cookie.encode()))
                    message["headers"] = headers
            await send(message)

        await self.app(scope, receive, send_wrapper)

    def _read_cookie(self, request: Request) -> str | None:
        raw = request.cookies.get(self.cookie_name)
        if not raw:
            return None
        try:
            return self.signer.loads(raw, max_age=self.max_age)
        except (BadSignature, SignatureExpired):
            return None
