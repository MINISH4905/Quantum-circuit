"""
Circuit IR -> PennyLane tape execution.

PennyLane uses a functional paradigm: gate operations are applied inside a
QNode-decorated function, with measurement returned as the function's return
value.  The builder here constructs callables that can be wrapped in a QNode.
"""

from __future__ import annotations

from typing import Callable

import pennylane as qml

from .gate_registry import GATES
from .models import QuantumCircuitModel, QuantumOperationModel

PL_SINGLE_GATES: dict[str, Callable] = {
    "h": qml.Hadamard,
    "x": qml.PauliX,
    "y": qml.PauliY,
    "z": qml.PauliZ,
    "s": qml.S,
    "t": qml.T,
}

PL_ROTATION_GATES: dict[str, Callable] = {
    "rx": qml.RX,
    "ry": qml.RY,
    "rz": qml.RZ,
}

PL_CONTROLLED_GATES: dict[str, Callable] = {
    "cx": qml.CNOT,
    "cz": qml.CZ,
}


class PennyLaneBuildError(Exception):
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


def _apply_operation(op: QuantumOperationModel) -> None:
    gate_id = op.gate

    if gate_id in PL_SINGLE_GATES:
        PL_SINGLE_GATES[gate_id](wires=op.targets[0])
        return

    if gate_id in PL_ROTATION_GATES:
        PL_ROTATION_GATES[gate_id](op.parameters[0], wires=op.targets[0])
        return

    if gate_id in PL_CONTROLLED_GATES:
        control = (op.controls or [0])[0]
        target = op.targets[0]
        PL_CONTROLLED_GATES[gate_id](wires=[control, target])
        return

    if gate_id == "swap":
        qml.SWAP(wires=[op.targets[0], op.targets[1]])
        return

    raise PennyLaneBuildError(f"Unsupported gate: {gate_id}", op.id)


def build_statevector_qnode(circuit: QuantumCircuitModel):
    """Build a PennyLane QNode that returns the full statevector."""
    num_wires = circuit.qubits
    dev = qml.device("default.qubit", wires=num_wires)

    @qml.qnode(dev)
    def qnode():
        for op in _ordered_operations(circuit):
            if op.gate == "measure":
                continue
            _apply_operation(op)
        return qml.state()

    return qnode


def build_counts_qnode(circuit: QuantumCircuitModel, shots: int):
    """Build a PennyLane QNode that returns sample-based probabilities."""
    num_wires = circuit.qubits
    dev = qml.device("default.qubit", wires=num_wires, shots=shots)

    @qml.qnode(dev)
    def qnode():
        for op in _ordered_operations(circuit):
            if op.gate == "measure":
                continue
            _apply_operation(op)
        return qml.counts(all_outcomes=True)

    return qnode
