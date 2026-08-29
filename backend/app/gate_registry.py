"""
Backend mirror of src/circuit/gate-registry/registry.ts.

This is the ONLY place gate semantics are declared on the backend — the
circuit builder and validator both look gates up here rather than hard-coding
behavior per gate id, matching the frontend's "centralized registry" rule.
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass(frozen=True)
class GateDefinition:
    id: str
    control_count: int
    target_count: int
    parameter_count: int
    qiskit_name: str
    cirq_name: Optional[str] = None
    pennylane_name: Optional[str] = None
    writes_classical_bit: bool = False


_GATES_LIST: list[GateDefinition] = [
    GateDefinition("h", 0, 1, 0, "h", cirq_name="H", pennylane_name="Hadamard"),
    GateDefinition("x", 0, 1, 0, "x", cirq_name="X", pennylane_name="PauliX"),
    GateDefinition("y", 0, 1, 0, "y", cirq_name="Y", pennylane_name="PauliY"),
    GateDefinition("z", 0, 1, 0, "z", cirq_name="Z", pennylane_name="PauliZ"),
    GateDefinition("s", 0, 1, 0, "s", cirq_name="S", pennylane_name="S"),
    GateDefinition("t", 0, 1, 0, "t", cirq_name="T", pennylane_name="T"),
    GateDefinition("rx", 0, 1, 1, "rx", cirq_name="rx", pennylane_name="RX"),
    GateDefinition("ry", 0, 1, 1, "ry", cirq_name="ry", pennylane_name="RY"),
    GateDefinition("rz", 0, 1, 1, "rz", cirq_name="rz", pennylane_name="RZ"),
    GateDefinition("cx", 1, 1, 0, "cx", cirq_name="CNOT", pennylane_name="CNOT"),
    GateDefinition("cz", 1, 1, 0, "cz", cirq_name="CZ", pennylane_name="CZ"),
    GateDefinition("swap", 0, 2, 0, "swap", cirq_name="SWAP", pennylane_name="SWAP"),
    GateDefinition("measure", 0, 1, 0, "measure", cirq_name="measure", pennylane_name="measure", writes_classical_bit=True),
]

GATES: dict[str, GateDefinition] = {g.id: g for g in _GATES_LIST}
GATES_BY_CIRQ_NAME: dict[str, GateDefinition] = {g.cirq_name: g for g in _GATES_LIST if g.cirq_name}
GATES_BY_PENNYLANE_NAME: dict[str, GateDefinition] = {g.pennylane_name: g for g in _GATES_LIST if g.pennylane_name}

SUPPORTED_GATE_NAMES = ", ".join(g.qiskit_name.upper() for g in _GATES_LIST)
