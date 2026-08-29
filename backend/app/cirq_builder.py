"""
Circuit IR -> Google Cirq circuit.

Mirrors the structure of circuit_builder.py (Qiskit) but targets
cirq.Circuit with cirq.LineQubit addressing.
"""

from __future__ import annotations

import cirq

from .gate_registry import GATES
from .models import QuantumCircuitModel, QuantumOperationModel

CIRQ_SINGLE_GATES = {
    "h": cirq.H,
    "x": cirq.X,
    "y": cirq.Y,
    "z": cirq.Z,
    "s": cirq.S,
    "t": cirq.T,
}

CIRQ_CONTROLLED_GATES = {
    "cx": cirq.CNOT,
    "cz": cirq.CZ,
}


class CirqBuildError(Exception):
    def __init__(self, message: str, operation_id: str | None = None):
        self.message = message
        self.operation_id = operation_id
        super().__init__(message)


def _ordered_operations(circuit: QuantumCircuitModel) -> list[QuantumOperationModel]:
    def sort_key(op: QuantumOperationModel):
        involved = [*(op.controls or []), *op.targets]
        min_qubit = min(involved) if involved else 0
        return (op.timeStep, min_qubit, op.id)

    return sorted(circuit.operations, key=sort_key)


def _make_cirq_operation(op: QuantumOperationModel, qubits: list[cirq.LineQubit]) -> cirq.Operation:
    gate_id = op.gate

    if gate_id in CIRQ_SINGLE_GATES:
        return CIRQ_SINGLE_GATES[gate_id](qubits[op.targets[0]])

    if gate_id == "rx":
        return cirq.rx(op.parameters[0])(qubits[op.targets[0]])
    if gate_id == "ry":
        return cirq.ry(op.parameters[0])(qubits[op.targets[0]])
    if gate_id == "rz":
        return cirq.rz(op.parameters[0])(qubits[op.targets[0]])

    if gate_id in CIRQ_CONTROLLED_GATES:
        control = (op.controls or [0])[0]
        target = op.targets[0]
        return CIRQ_CONTROLLED_GATES[gate_id](qubits[control], qubits[target])

    if gate_id == "swap":
        return cirq.SWAP(qubits[op.targets[0]], qubits[op.targets[1]])

    raise CirqBuildError(f"Unsupported gate: {gate_id}", op.id)


def build_statevector_circuit(circuit: QuantumCircuitModel) -> tuple[cirq.Circuit, list[cirq.LineQubit]]:
    """Build a Cirq circuit without measurements (for statevector simulation)."""
    qubits = cirq.LineQubit.range(circuit.qubits)
    ops: list[cirq.Operation] = []

    for op in _ordered_operations(circuit):
        if op.gate == "measure":
            continue
        ops.append(_make_cirq_operation(op, qubits))

    return cirq.Circuit(ops), qubits


def build_counts_circuit(circuit: QuantumCircuitModel) -> tuple[cirq.Circuit, list[cirq.LineQubit]]:
    """Build a Cirq circuit with measurements (for shot-based simulation)."""
    qubits = cirq.LineQubit.range(circuit.qubits)
    ops: list[cirq.Operation] = []

    for op in _ordered_operations(circuit):
        if op.gate == "measure":
            continue
        ops.append(_make_cirq_operation(op, qubits))

    measure_ops = [op for op in circuit.operations if op.gate == "measure"]
    if measure_ops:
        for op in sorted(measure_ops, key=lambda o: o.timeStep):
            q = op.targets[0]
            ops.append(cirq.measure(qubits[q], key=f"q{q}"))
    else:
        for i in range(circuit.qubits):
            ops.append(cirq.measure(qubits[i], key=f"q{i}"))

    return cirq.Circuit(ops), qubits
