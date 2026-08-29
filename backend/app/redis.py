from __future__ import annotations

import redis.asyncio as aioredis

from .config import get_settings

_redis: aioredis.Redis | None = None


async def init_redis() -> aioredis.Redis:
    global _redis
    settings = get_settings()
    _redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    await _redis.ping()
    return _redis


def get_redis() -> aioredis.Redis:
    if _redis is None:
        raise RuntimeError("Redis not initialized — call init_redis() first")
    return _redis


async def close_redis() -> None:
    global _redis
    if _redis:
        await _redis.aclose()
        _redis = None
