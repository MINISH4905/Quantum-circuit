from __future__ import annotations

import math

from fastapi import FastAPI, HTTPException, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .circuit_builder import CircuitBuildError
from .models import BlochAngle, ComplexModel, SimulateRequest, SimulateResponse
from .simulator import SimulationError, compute_bloch_angles, run_counts, run_statevector
from .validation import validate_circuit

app = FastAPI(title="Quantum Circuit Editor — Simulation Backend", version="1.0.0")


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

# Local Vite dev server origins only — this is a local development backend,
# not a public-facing deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


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
