"""
Circuit IR -> Qiskit QuantumCircuit.

Mirrors src/circuit/generator/qiskit-generator.ts: operations are applied in
deterministic (timeStep, then lowest involved qubit, then operation id) order,
and gate arguments are built as parameters + controls + targets, which lines
up with every registered gate's actual Qiskit method signature (e.g.
rx(theta, qubit), cx(control, target), swap(q0, q1)).
"""

from __future__ import annotations

from qiskit import QuantumCircuit as QiskitCircuit
from qiskit.circuit import ClassicalRegister, QuantumRegister

from .gate_registry import GATES
from .models import QuantumCircuitModel, QuantumOperationModel


class CircuitBuildError(Exception):
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


def _build_base_circuit(circuit: QuantumCircuitModel) -> QiskitCircuit:
    """Build the circuit up to (but not including) any measurements."""
    qr = QuantumRegister(circuit.qubits, "q")
    if circuit.classicalBits > 0:
        cr = ClassicalRegister(circuit.classicalBits, "c")
        qc = QiskitCircuit(qr, cr)
    else:
        qc = QiskitCircuit(qr)

    for op in _ordered_operations(circuit):
        if op.gate == "measure":
            continue  # applied later, differently, depending on statevector vs. counts mode

        gate = GATES.get(op.gate)
        if gate is None:
            raise CircuitBuildError(f"Unsupported gate: {op.gate}", op.id)

        method = getattr(qc, gate.qiskit_name, None)
        if method is None:
            raise CircuitBuildError(f"Gate '{op.gate}' has no Qiskit equivalent", op.id)

        args = [*(op.parameters or []), *(op.controls or []), *op.targets]
        try:
            method(*args)
        except Exception as exc:  # noqa: BLE001 - surfaced as a clean build error
            raise CircuitBuildError(f"Failed to apply gate '{op.gate}': {exc}", op.id) from exc

    return qc


def build_statevector_circuit(circuit: QuantumCircuitModel) -> QiskitCircuit:
    """Circuit with no measurements, ending in a save_statevector instruction."""
    qc = _build_base_circuit(circuit)
    qc.save_statevector()
    return qc


def build_counts_circuit(circuit: QuantumCircuitModel) -> QiskitCircuit:
    """
    Circuit with measurements applied. If the IR contains explicit `measure`
    operations, classical bit == qubit index (the frontend's enforced
    convention). If it contains none, every qubit is measured, matching the
    local simulator's fallback behavior.
    """
    qc = _build_base_circuit(circuit)
    measure_ops = [op for op in circuit.operations if op.gate == "measure"]

    if measure_ops:
        for op in sorted(measure_ops, key=lambda o: o.timeStep):
            qubit = op.targets[0]
            qc.measure(qubit, qubit)
    else:
        if circuit.classicalBits < circuit.qubits:
            extra = ClassicalRegister(circuit.qubits, "c_auto")
            qc.add_register(extra)
            qc.measure(range(circuit.qubits), extra)
        else:
            qc.measure(range(circuit.qubits), range(circuit.qubits))

    return qc
