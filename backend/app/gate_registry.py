"""
Backend mirror of src/circuit/gate-registry/registry.ts.

This is the ONLY place gate semantics are declared on the backend — the
circuit builder and validator both look gates up here rather than hard-coding
behavior per gate id, matching the frontend's "centralized registry" rule.
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class GateDefinition:
    id: str
    control_count: int
    target_count: int
    parameter_count: int
    qiskit_name: str
    writes_classical_bit: bool = False


_GATES_LIST: list[GateDefinition] = [
    GateDefinition("h", 0, 1, 0, "h"),
    GateDefinition("x", 0, 1, 0, "x"),
    GateDefinition("y", 0, 1, 0, "y"),
    GateDefinition("z", 0, 1, 0, "z"),
    GateDefinition("s", 0, 1, 0, "s"),
    GateDefinition("t", 0, 1, 0, "t"),
    GateDefinition("rx", 0, 1, 1, "rx"),
    GateDefinition("ry", 0, 1, 1, "ry"),
    GateDefinition("rz", 0, 1, 1, "rz"),
    GateDefinition("cx", 1, 1, 0, "cx"),
    GateDefinition("cz", 1, 1, 0, "cz"),
    GateDefinition("swap", 0, 2, 0, "swap"),
    GateDefinition("measure", 0, 1, 0, "measure", writes_classical_bit=True),
]

GATES: dict[str, GateDefinition] = {g.id: g for g in _GATES_LIST}

SUPPORTED_GATE_NAMES = ", ".join(g.qiskit_name.upper() for g in _GATES_LIST)
