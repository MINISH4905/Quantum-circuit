from __future__ import annotations

import math
import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import time
from concurrent.futures import ThreadPoolExecutor, as_completed

import numpy as np

from .circuit_builder import CircuitBuildError
from .cirq_builder import CirqBuildError
from .pennylane_builder import PennyLaneBuildError
from .llm_provider import OllamaTutorProvider, TutorLLMProvider
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


def _run_backend(backend: SimulationBackend, circuit, shots: int) -> tuple[list[ComplexModel], dict[str, int], list[BlochAngle]]:
    """Dispatch simulation to the chosen backend and return normalized results."""
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
    except Exception as exc:  # noqa: BLE001
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
            except Exception as exc:  # noqa: BLE001
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
    except Exception as exc:  # noqa: BLE001 - never let an unexpected error crash the process
        raise HTTPException(status_code=500, detail={"message": "Internal simulation error"}) from exc

    return build_tutor_response(circuit, sv, bloch, provider)
