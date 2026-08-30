from __future__ import annotations

import json
import logging
import math
import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from contextlib import asynccontextmanager

import numpy as np
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import get_settings
from .db.session import create_tables
from .redis import close_redis, init_redis
from .routers.auth import router as auth_router
from .routers.groups import router as groups_router
from .routers.users import router as users_router
from .session import RedisSessionMiddleware

logger = logging.getLogger(__name__)

_qiskit_available = False
try:
    from .circuit_builder import CircuitBuildError
    from .cirq_builder import CirqBuildError
    from .pennylane_builder import PennyLaneBuildError
    from .llm_provider import GroqTutorProvider, LLMNotConfiguredError, LLMProviderError, TutorLLMProvider
    from .models import (
        BackendResult,
        BlochAngle,
        CompareRequest,
        CompareResponse,
        ComplexModel,
        SimulateRequest,
        SimulateResponse,
        SimulationBackend,
    )
    from .simulator import SimulationError, compute_bloch_angles, run_counts, run_statevector
    from . import cirq_simulator
    from . import pennylane_simulator
    from .bloch import compute_bloch_angles as compute_bloch_angles_np
    from .tutor import build_tutor_response
    from .tutor_models import TutorAnalyzeRequest, TutorAnalyzeResponse
    from .validation import validate_circuit
    _qiskit_available = True
except ImportError:
    pass

from .llm_provider import GroqTutorProvider as _GroqProvider, LLMNotConfiguredError, LLMProviderError
from .tutor_models import (
    GenerateCircuitRequest,
    GenerateCircuitResponse,
    SourceInfo,
    TutorChatRequest,
    TutorChatResponse,
)

_default_tutor_provider = _GroqProvider()


def get_tutor_provider():
    return _default_tutor_provider


@asynccontextmanager
async def lifespan(_: FastAPI):
    await init_redis()
    await create_tables()
    if _default_tutor_provider:
        _default_tutor_provider.warm_up()
    try:
        from .rag.pipeline import init_rag_pipeline
        await init_rag_pipeline()
    except Exception as exc:
        logger.warning("RAG pipeline init failed (chat will work without RAG): %s", exc)
    yield
    await close_redis()


settings = get_settings()

app = FastAPI(title="Quantum Circuit Editor — Simulation Backend", version="1.0.0", lifespan=lifespan)


def _json_safe(obj):
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)

app.add_middleware(
    RedisSessionMiddleware,
    secret=settings.SESSION_SECRET,
    cookie_name=settings.SESSION_COOKIE_NAME,
    max_age=settings.SESSION_MAX_AGE,
    secure=settings.ENV == "production",
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(groups_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def _build_circuit_context(request: TutorChatRequest) -> str | None:
    if not request.circuit or not request.circuit.operations:
        return None
    ops = sorted(request.circuit.operations, key=lambda op: (op.timeStep, op.id))
    lines = [f"{request.circuit.qubits} qubit(s), {request.circuit.classicalBits} classical bit(s). Gates:"]
    for op in ops:
        controls = f", control=q{op.controls}" if op.controls else ""
        lines.append(f"  step {op.timeStep}: {op.gate.upper()}(targets=q{op.targets}{controls})")
    return "\n".join(lines)


def _run_rag(question: str) -> tuple[str | None, list[SourceInfo], float]:
    try:
        from .rag.pipeline import get_rag_pipeline
        pipeline = get_rag_pipeline()
        if pipeline is None:
            return None, [], 0.55
        result = pipeline.answer(question)
        sources = [
            SourceInfo(
                index=s.index,
                title=s.title,
                framework=s.framework,
                doc_type=s.doc_type,
                url=s.source_url,
                heading_path=s.heading_path,
            )
            for s in result.sources
        ]
        return result.context, sources, result.confidence_score
    except Exception as exc:
        logger.warning("RAG retrieval failed: %s", exc)
        return None, [], 0.55


@app.post("/api/tutor/chat", response_model=TutorChatResponse)
def tutor_chat(request: TutorChatRequest) -> TutorChatResponse:
    provider = get_tutor_provider()
    if provider is None or not provider.is_configured():
        raise HTTPException(status_code=503, detail="AI tutor is not configured (missing GROQ_API_KEY)")

    circuit_context = _build_circuit_context(request)
    history = [{"role": m.role, "content": m.content} for m in request.history[-10:]]
    rag_context, sources, confidence = _run_rag(request.question)

    try:
        answer = provider.chat(
            question=request.question,
            circuit_context=circuit_context,
            history=history,
            rag_context=rag_context,
        )
    except (LLMNotConfiguredError, LLMProviderError) as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return TutorChatResponse(answer=answer, sources=sources, confidence_score=confidence)


@app.post("/api/tutor/chat/stream")
async def tutor_chat_stream(request: TutorChatRequest):
    from sse_starlette.sse import EventSourceResponse

    provider = get_tutor_provider()
    if provider is None or not provider.is_configured():
        raise HTTPException(status_code=503, detail="AI tutor is not configured (missing GROQ_API_KEY)")

    circuit_context = _build_circuit_context(request)
    history = [{"role": m.role, "content": m.content} for m in request.history[-10:]]
    rag_context, sources, confidence = _run_rag(request.question)

    async def event_generator():
        if sources:
            yield {
                "event": "sources",
                "data": json.dumps([s.model_dump() for s in sources]),
            }
        yield {
            "event": "confidence",
            "data": json.dumps(confidence),
        }

        try:
            async for token in provider.chat_stream(
                question=request.question,
                circuit_context=circuit_context,
                history=history,
                rag_context=rag_context,
            ):
                yield {"event": "token", "data": token}
        except (LLMNotConfiguredError, LLMProviderError) as exc:
            yield {"event": "error", "data": str(exc)}
            return

        yield {"event": "done", "data": ""}

    return EventSourceResponse(event_generator())


@app.get("/api/admin/rag/status")
def rag_status():
    try:
        from .rag.pipeline import get_rag_pipeline
        from .rag.config import get_rag_settings
        pipeline = get_rag_pipeline()
        settings = get_rag_settings()
        if pipeline is None:
            return {"enabled": False, "reason": "Pipeline not initialized"}
        count = pipeline.retriever.vector_store.count()
        return {
            "enabled": True,
            "chunks_indexed": count,
            "bm25_built": pipeline.retriever.bm25_index.is_built,
            "kb_dir": str(settings.knowledge_base_dir),
            "embedding_model": settings.embedding_model,
        }
    except Exception as exc:
        return {"enabled": False, "reason": str(exc)}


@app.post("/api/admin/rag/ingest")
def rag_ingest(force: bool = False):
    try:
        from .rag.config import get_rag_settings
        from .rag.ingest import ingest
        settings = get_rag_settings()
        result = ingest(settings.knowledge_base_dir, settings, force=force)
        return {"status": "ok", "result": str(result)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/tutor/generate-circuit", response_model=GenerateCircuitResponse)
def tutor_generate_circuit(request: GenerateCircuitRequest) -> GenerateCircuitResponse:
    provider = get_tutor_provider()
    if provider is None or not provider.is_configured():
        raise HTTPException(status_code=503, detail="AI tutor is not configured (missing GROQ_API_KEY)")

    try:
        code = provider.generate_circuit_code(title=request.title, description=request.content)
    except (LLMNotConfiguredError, LLMProviderError) as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return GenerateCircuitResponse(code=code)


if _qiskit_available:

    def _run_backend(backend: SimulationBackend, circuit, shots: int) -> tuple[list[ComplexModel], dict[str, int], list[BlochAngle]]:
        if backend == SimulationBackend.QISKIT:
            sv = run_statevector(circuit)
            counts = run_counts(circuit, shots)
            bloch = compute_bloch_angles(sv, circuit.qubits)
            sv_list = [ComplexModel(real=amp.real, imag=amp.imag) for amp in sv.data]
        elif backend == SimulationBackend.CIRQ:
            sv_arr = cirq_simulator.run_statevector(circuit)
            counts = cirq_simulator.run_counts(circuit, shots)
            bloch = cirq_simulator.run_bloch_angles(sv_arr, circuit.qubits)
            sv_list = [ComplexModel(real=float(c.real), imag=float(c.imag)) for c in sv_arr]
        elif backend == SimulationBackend.PENNYLANE:
            sv_arr = pennylane_simulator.run_statevector(circuit)
            counts = pennylane_simulator.run_counts(circuit, shots)
            bloch = pennylane_simulator.run_bloch_angles(sv_arr, circuit.qubits)
            sv_list = [ComplexModel(real=float(c.real), imag=float(c.imag)) for c in sv_arr]
        else:
            raise HTTPException(status_code=400, detail={"message": f"Unknown backend: {backend}"})

        return sv_list, counts, [BlochAngle(**b) for b in bloch]

    _BUILD_ERRORS = (CircuitBuildError, CirqBuildError, PennyLaneBuildError)

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
            sv_list, counts, bloch = _run_backend(request.backend, circuit, request.shots)
        except _BUILD_ERRORS as exc:
            raise HTTPException(
                status_code=422,
                detail={"message": exc.message, "operationId": getattr(exc, "operation_id", None)},
            ) from exc
        except SimulationError as exc:
            raise HTTPException(status_code=500, detail={"message": exc.message}) from exc
        except Exception as exc:
            raise HTTPException(status_code=500, detail={"message": "Internal simulation error"}) from exc

        return SimulateResponse(
            statevector=sv_list,
            measurement_histogram=counts,
            bloch_angles=bloch,
            shots=request.shots,
        )

    def _run_single_compare(backend: SimulationBackend, circuit, shots: int) -> BackendResult:
        t0 = time.perf_counter()
        sv_list, counts, bloch = _run_backend(backend, circuit, shots)
        elapsed = (time.perf_counter() - t0) * 1000
        return BackendResult(
            statevector=sv_list,
            measurement_histogram=counts,
            bloch_angles=bloch,
            shots=shots,
            timing_ms=round(elapsed, 2),
        )

    @app.post("/simulate/compare", response_model=CompareResponse)
    def simulate_compare(request: CompareRequest) -> CompareResponse:
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

        backends = [SimulationBackend.QISKIT, SimulationBackend.CIRQ, SimulationBackend.PENNYLANE]
        results: dict[str, BackendResult] = {}
        errors: list[str] = []

        with ThreadPoolExecutor(max_workers=3) as pool:
            futures = {pool.submit(_run_single_compare, b, circuit, request.shots): b for b in backends}
            for future in as_completed(futures):
                backend = futures[future]
                try:
                    results[backend.value] = future.result()
                except Exception as exc:
                    errors.append(f"{backend.value}: {exc}")

        if errors:
            raise HTTPException(status_code=500, detail={"message": "Backend errors: " + "; ".join(errors)})

        svs = []
        for b in backends:
            r = results[b.value]
            svs.append(np.array([complex(c.real, c.imag) for c in r.statevector]))

        agreement = all(np.allclose(svs[0], sv, atol=1e-6) for sv in svs[1:])

        return CompareResponse(results=results, agreement=agreement)

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
        except Exception as exc:
            raise HTTPException(status_code=500, detail={"message": "Internal simulation error"}) from exc

        return build_tutor_response(circuit, sv, bloch, provider)

else:

    @app.post("/simulate")
    def simulate_unavailable():
        raise HTTPException(status_code=503, detail="Quantum simulation is not available on this server")

    @app.post("/simulate/compare")
    def compare_unavailable():
        raise HTTPException(status_code=503, detail="Quantum simulation is not available on this server")

    @app.post("/api/tutor/analyze")
    def tutor_unavailable():
        raise HTTPException(status_code=503, detail="Quantum simulation is not available on this server")
