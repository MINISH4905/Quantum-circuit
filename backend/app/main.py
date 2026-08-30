from __future__ import annotations

import math
import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .circuit_builder import CircuitBuildError
from .learning_content import (
    LearningContentUnavailable,
    get_collection,
    get_document,
    list_collections,
    list_documents_for_collection,
)
from .llm_provider import OllamaTutorProvider, TutorLLMProvider
from .models import BlochAngle, ComplexModel, SimulateRequest, SimulateResponse
from .simulator import SimulationError, compute_bloch_angles, run_counts, run_statevector
from .tutor import build_tutor_response
from .tutor_models import TutorAnalyzeRequest, TutorAnalyzeResponse
from .validation import validate_circuit

# Created once at import time; overridden in tests via
# app.dependency_overrides[get_tutor_provider] so tests never need a live LLM.
_default_tutor_provider: TutorLLMProvider = OllamaTutorProvider()


def get_tutor_provider() -> TutorLLMProvider:
    return _default_tutor_provider


@asynccontextmanager
async def lifespan(_: FastAPI):
    _default_tutor_provider.warm_up()
    yield


app = FastAPI(title="Quantum Circuit Editor — Simulation Backend", version="1.0.0", lifespan=lifespan)


def _json_safe(obj):
    """Recursively replace non-finite floats (NaN/Infinity) so error bodies
    that echo back invalid request input never fail Starlette's strict
    (allow_nan=False) JSON encoder."""
    if isinstance(obj, float):
        return str(obj) if (math.isnan(obj) or math.isinf(obj)) else obj
    if isinstance(obj, dict):
        return {k: _json_safe(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_json_safe(v) for v in obj]
    return obj


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    safe_errors = _json_safe(jsonable_encoder(exc.errors()))
    return JSONResponse(status_code=422, content={"detail": safe_errors})

# Defaults to the local Vite dev server; in production, set ALLOWED_ORIGINS
# to a comma-separated list (e.g. the deployed Vercel frontend's URL).
_default_origins = "http://localhost:5173,http://127.0.0.1:5173"
allowed_origins = [
    origin.strip() for origin in os.environ.get("ALLOWED_ORIGINS", _default_origins).split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


# Qiskit learning content — fetched from github.com/Qiskit/documentation
# (learning/) by scripts/ingest_learning_content.py, served here so the
# Learner roadmap can pull real lesson material instead of a static file.
@app.get("/api/learning/collections")
def learning_collections() -> list[dict]:
    try:
        return list_collections()
    except LearningContentUnavailable as exc:
        raise HTTPException(status_code=503, detail={"message": str(exc)}) from exc


@app.get("/api/learning/collections/{collection_id:path}")
def learning_collection_detail(collection_id: str) -> dict:
    try:
        collection = get_collection(collection_id)
    except LearningContentUnavailable as exc:
        raise HTTPException(status_code=503, detail={"message": str(exc)}) from exc
    if not collection:
        raise HTTPException(status_code=404, detail={"message": f"Unknown collection: {collection_id}"})
    return {**collection, "documents": list_documents_for_collection(collection_id)}


@app.get("/api/learning/documents/{doc_path:path}")
def learning_document_detail(doc_path: str) -> dict:
    try:
        document = get_document(doc_path)
    except LearningContentUnavailable as exc:
        raise HTTPException(status_code=503, detail={"message": str(exc)}) from exc
    if not document:
        raise HTTPException(status_code=404, detail={"message": f"Unknown document: {doc_path}"})
    return document


@app.post("/simulate", response_model=SimulateResponse)
def simulate(request: SimulateRequest) -> SimulateResponse:
    circuit = request.circuit

    validation_errors = validate_circuit(circuit)
    if validation_errors:
        raise HTTPException(
            status_code=422,
            detail={
                "message": "Circuit validation failed",
                "errors": [{"message": e.message, "operationId": e.operation_id} for e in validation_errors],
            },
        )

    try:
        sv = run_statevector(circuit)
        counts = run_counts(circuit, request.shots)
        bloch = compute_bloch_angles(sv, circuit.qubits)
    except CircuitBuildError as exc:
        raise HTTPException(
            status_code=422,
            detail={"message": exc.message, "operationId": exc.operation_id},
        ) from exc
    except SimulationError as exc:
        raise HTTPException(status_code=500, detail={"message": exc.message}) from exc
    except Exception as exc:  # noqa: BLE001 - never let an unexpected error crash the process
        raise HTTPException(status_code=500, detail={"message": "Internal simulation error"}) from exc

    return SimulateResponse(
        statevector=[ComplexModel(real=amp.real, imag=amp.imag) for amp in sv.data],
        measurement_histogram=counts,
        bloch_angles=[BlochAngle(**b) for b in bloch],
        shots=request.shots,
    )


@app.post("/api/tutor/analyze", response_model=TutorAnalyzeResponse)
def tutor_analyze(
    request: TutorAnalyzeRequest, provider: TutorLLMProvider = Depends(get_tutor_provider)
) -> TutorAnalyzeResponse:
    circuit = request.circuit

    validation_errors = validate_circuit(circuit)
    if validation_errors:
        raise HTTPException(
            status_code=422,
            detail={
                "message": "Circuit validation failed",
                "errors": [{"message": e.message, "operationId": e.operation_id} for e in validation_errors],
            },
        )

    try:
        sv = run_statevector(circuit)
        bloch = compute_bloch_angles(sv, circuit.qubits)
    except CircuitBuildError as exc:
        raise HTTPException(
            status_code=422,
            detail={"message": exc.message, "operationId": exc.operation_id},
        ) from exc
    except SimulationError as exc:
        raise HTTPException(status_code=500, detail={"message": exc.message}) from exc
    except Exception as exc:  # noqa: BLE001 - never let an unexpected error crash the process
        raise HTTPException(status_code=500, detail={"message": "Internal simulation error"}) from exc

    return build_tutor_response(circuit, sv, bloch, provider)
