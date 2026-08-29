"""Request/response models for POST /api/tutor/analyze."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel

from .models import QuantumCircuitModel


class TutorAnalyzeRequest(BaseModel):
    circuit: QuantumCircuitModel


class TutorWarning(BaseModel):
    detected: bool
    message: str


class TutorAnalyzeResponse(BaseModel):
    explanation: str
    warning: TutorWarning
    optimization: str
    # Additive beyond the base contract: lets the frontend show a subtle
    # "AI unavailable, showing rule-based analysis" note without treating it
    # as an error state.
    source: Literal["llm", "deterministic"]
