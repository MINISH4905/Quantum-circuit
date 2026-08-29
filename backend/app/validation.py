"""
Circuit-level validation, mirroring the rules in
src/circuit/validation/validate.ts. The backend is a separate trust boundary
from the frontend, so it re-validates everything rather than trusting that a
request came from the React app's own already-validated store.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Optional

from .gate_registry import GATES
from .models import QuantumCircuitModel, QuantumOperationModel


@dataclass
class ValidationError:
    message: str
    operation_id: Optional[str] = None


def validate_operation(op: QuantumOperationModel, qubits: int, classical_bits: int) -> list[ValidationError]:
    errors: list[ValidationError] = []
    gate = GATES.get(op.gate)

    if gate is None:
        return [ValidationError(f"Unknown gate: {op.gate}", op.id)]

    controls = op.controls or []
    targets = op.targets or []

    if len(controls) != gate.control_count:
        errors.append(
            ValidationError(
                f"{op.gate} requires {gate.control_count} control qubit(s), got {len(controls)}", op.id
            )
        )

    if len(targets) != gate.target_count:
        errors.append(
            ValidationError(f"{op.gate} requires {gate.target_count} target qubit(s), got {len(targets)}", op.id)
        )

    for q in [*controls, *targets]:
        if q < 0 or q >= qubits:
            errors.append(ValidationError(f"Invalid qubit index {q}: circuit has {qubits} qubit(s)", op.id))

    all_qubits = [*controls, *targets]
    if len(set(all_qubits)) != len(all_qubits):
        errors.append(ValidationError(f"{op.gate} cannot use the same qubit as both control and target", op.id))

    params = op.parameters or []
    if len(params) != gate.parameter_count:
        errors.append(
            ValidationError(f"{op.gate} requires {gate.parameter_count} parameter(s), got {len(params)}", op.id)
        )
    for p in params:
        if not math.isfinite(p):
            errors.append(ValidationError(f"{op.gate} has a non-finite parameter value", op.id))

    if gate.writes_classical_bit:
        target = targets[0] if targets else None
        if target is not None and target >= classical_bits:
            errors.append(
                ValidationError(
                    f"Measure target qubit {target} has no matching classical bit "
                    f"(classicalBits={classical_bits})",
                    op.id,
                )
            )

    return errors


def validate_circuit(circuit: QuantumCircuitModel) -> list[ValidationError]:
    errors: list[ValidationError] = []

    if circuit.qubits < 1:
        errors.append(ValidationError("Circuit must have at least 1 qubit"))
    if circuit.classicalBits < 0:
        errors.append(ValidationError("classicalBits must be a non-negative integer"))

    for op in circuit.operations:
        errors.extend(validate_operation(op, circuit.qubits, circuit.classicalBits))

    return errors
