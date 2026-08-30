from __future__ import annotations

import logging

import redis.asyncio as aioredis

from .config import get_settings

logger = logging.getLogger(__name__)

_redis: aioredis.Redis | None = None


async def init_redis() -> aioredis.Redis:
    global _redis
    settings = get_settings()
    try:
        _redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        await _redis.ping()
    except Exception:
        import fakeredis.aioredis as fake
        logger.warning("Real Redis unavailable — using in-memory fakeredis (dev only)")
        _redis = fake.FakeRedis(decode_responses=True)
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
