"""Request/response models for POST /api/tutor/analyze."""

from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel

from .models import QuantumCircuitModel


class TutorAnalyzeRequest(BaseModel):
    circuit: QuantumCircuitModel


class TutorWarning(BaseModel):
    detected: bool
    message: str


class TutorStep(BaseModel):
    step: int
    gate: str
    qubits: str
    action: str
    stateAfter: str
    opId: Optional[str] = None


class TutorGateDefinition(BaseModel):
    gate: str
    definition: str
    matrix: Optional[str] = None


class TutorAnalyzeResponse(BaseModel):
    explanation: str
    steps: list[TutorStep]
    gateDefinitions: list[TutorGateDefinition]
    algorithm: str
    warning: TutorWarning
    optimization: str
    source: Literal["llm", "deterministic"]
    confidence_score: float = 0.0


class ChatMessageModel(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class TutorChatRequest(BaseModel):
    question: str
    circuit: Optional[QuantumCircuitModel] = None
    history: list[ChatMessageModel] = []


class SourceInfo(BaseModel):
    index: int
    title: str
    framework: str = ""
    doc_type: str = ""
    url: str = ""
    heading_path: str = ""


class TutorChatResponse(BaseModel):
    answer: str
    sources: list[SourceInfo] = []
    confidence_score: float = 0.0


class GenerateCircuitRequest(BaseModel):
    title: str
    content: str = ""


class GenerateCircuitResponse(BaseModel):
    code: str
