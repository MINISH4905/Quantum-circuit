from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")


@dataclass(frozen=True)
class Settings:
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str
    DATABASE_URL: str
    REDIS_URL: str
    SESSION_SECRET: str
    SESSION_MAX_AGE: int
    SESSION_COOKIE_NAME: str
    FRONTEND_URL: str
    ENV: str
    ALLOWED_ORIGINS: list[str]
    OLLAMA_BASE_URL: str | None
    OLLAMA_MODEL: str | None


@lru_cache
def get_settings() -> Settings:
    raw_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
    return Settings(
        GOOGLE_CLIENT_ID=os.environ.get("GOOGLE_CLIENT_ID", ""),
        GOOGLE_CLIENT_SECRET=os.environ.get("GOOGLE_CLIENT_SECRET", ""),
        GOOGLE_REDIRECT_URI=os.environ.get("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/google/callback"),
        DATABASE_URL=os.environ.get("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/quantumlab"),
        REDIS_URL=os.environ.get("REDIS_URL", "redis://localhost:6379/0"),
        SESSION_SECRET=os.environ.get("SESSION_SECRET", "change-me-in-production-use-a-64-char-hex-string"),
        SESSION_MAX_AGE=int(os.environ.get("SESSION_MAX_AGE", "604800")),
        SESSION_COOKIE_NAME=os.environ.get("SESSION_COOKIE_NAME", "qlsession"),
        FRONTEND_URL=os.environ.get("FRONTEND_URL", "http://localhost:5173"),
        ENV=os.environ.get("ENV", "development"),
        ALLOWED_ORIGINS=[o.strip() for o in raw_origins.split(",") if o.strip()],
        OLLAMA_BASE_URL=os.environ.get("OLLAMA_BASE_URL"),
        OLLAMA_MODEL=os.environ.get("OLLAMA_MODEL"),
    )
