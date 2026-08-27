"""
Pydantic request/response models mirroring the frontend's canonical Circuit IR
(src/circuit/model/types.ts). This is intentionally a structural mirror, not a
reinvention — see that file before changing shapes here.
"""

from __future__ import annotations

import math
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class QuantumOperationModel(BaseModel):
    """Mirrors QuantumOperation in src/circuit/model/types.ts."""

    id: str
    gate: str
    targets: list[int] = Field(default_factory=list)
    controls: Optional[list[int]] = None
    parameters: Optional[list[float]] = None
    timeStep: int

    @field_validator("parameters")
    @classmethod
    def parameters_must_be_finite(cls, v: Optional[list[float]]) -> Optional[list[float]]:
        if v is not None:
            for p in v:
                if not math.isfinite(p):
                    raise ValueError("parameter values must be finite numbers")
        return v


class QuantumCircuitModel(BaseModel):
    """Mirrors QuantumCircuit in src/circuit/model/types.ts."""

    version: int
    qubits: int
    classicalBits: int
    operations: list[QuantumOperationModel] = Field(default_factory=list)

    @field_validator("version")
    @classmethod
    def version_must_be_supported(cls, v: int) -> int:
        if v != 1:
            raise ValueError(f"Unsupported circuit schema version: {v} (expected 1)")
        return v


class SimulateRequest(BaseModel):
    circuit: QuantumCircuitModel
    shots: int = Field(default=1024, gt=0, le=100_000)


class ComplexModel(BaseModel):
    real: float
    imag: float


class BlochAngle(BaseModel):
    qubit: int
    theta: Optional[float] = None
    phi: Optional[float] = None
    r: float
    pure: bool


class SimulateResponse(BaseModel):
    statevector: list[ComplexModel]
    measurement_histogram: dict[str, int]
    bloch_angles: list[BlochAngle]
    shots: int
