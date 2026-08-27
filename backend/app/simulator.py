"""
Execution layer: runs circuits on Qiskit Aer and derives the statevector,
measurement histogram, and per-qubit Bloch angles from the results.
"""

from __future__ import annotations

import math

from qiskit.quantum_info import DensityMatrix, Statevector, partial_trace
from qiskit_aer import AerSimulator

from .circuit_builder import build_counts_circuit, build_statevector_circuit
from .models import QuantumCircuitModel

# Below this Bloch-vector magnitude, the reduced single-qubit state is too
# mixed (e.g. maximally entangled with another qubit) for theta/phi to mean
# anything — the point isn't on the sphere's surface at all.
PURITY_THRESHOLD = 0.999


class SimulationError(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


def run_statevector(circuit: QuantumCircuitModel) -> Statevector:
    qc = build_statevector_circuit(circuit)
    backend = AerSimulator(method="statevector")
    try:
        result = backend.run(qc).result()
        if not result.success:
            raise SimulationError(str(result.status))
        raw = result.get_statevector(qc)
    except SimulationError:
        raise
    except Exception as exc:  # noqa: BLE001
        raise SimulationError(f"Aer statevector simulation failed: {exc}") from exc
    return Statevector(raw)


def run_counts(circuit: QuantumCircuitModel, shots: int) -> dict[str, int]:
    qc = build_counts_circuit(circuit)
    backend = AerSimulator()
    try:
        result = backend.run(qc, shots=shots).result()
        if not result.success:
            raise SimulationError(str(result.status))
        counts = result.get_counts(qc)
    except SimulationError:
        raise
    except Exception as exc:  # noqa: BLE001
        raise SimulationError(f"Aer shot simulation failed: {exc}") from exc
    return dict(counts)


def compute_bloch_angles(sv: Statevector, num_qubits: int) -> list[dict]:
    """
    Reduced single-qubit Bloch vector for each qubit, via partial trace of the
    full statevector's density matrix. For an entangled qubit the reduced
    state is mixed (Bloch vector length r < 1); below PURITY_THRESHOLD we
    report theta/phi as None rather than a misleading point on the sphere.
    """
    full_dm = DensityMatrix(sv)
    angles: list[dict] = []

    for q in range(num_qubits):
        trace_out = [i for i in range(num_qubits) if i != q]
        reduced = partial_trace(full_dm, trace_out) if trace_out else full_dm
        rho = reduced.data

        rx = 2 * rho[0, 1].real
        ry = -2 * rho[0, 1].imag
        rz = (rho[0, 0] - rho[1, 1]).real
        r = math.sqrt(rx * rx + ry * ry + rz * rz)

        if r >= PURITY_THRESHOLD:
            clamped_rz_over_r = max(-1.0, min(1.0, rz / r))
            theta = math.acos(clamped_rz_over_r)
            phi = math.atan2(ry, rx)
            pure = True
        else:
            theta = None
            phi = None
            pure = False

        angles.append({"qubit": q, "theta": theta, "phi": phi, "r": r, "pure": pure})

    return angles
