"""
Execution layer for PennyLane: statevector simulation, shot-based counts,
and Bloch angles via the shared bloch module.
"""

from __future__ import annotations

import numpy as np

from .pennylane_builder import build_statevector_qnode, build_counts_qnode, PennyLaneBuildError
from .bloch import compute_bloch_angles
from .models import QuantumCircuitModel


class PennyLaneSimulationError(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


def run_statevector(circuit: QuantumCircuitModel) -> np.ndarray:
    """Run statevector simulation via PennyLane default.qubit."""
    qnode = build_statevector_qnode(circuit)
    try:
        sv = qnode()
        return np.array(sv)
    except PennyLaneBuildError:
        raise
    except Exception as exc:
        raise PennyLaneSimulationError(f"PennyLane statevector simulation failed: {exc}") from exc


def run_counts(circuit: QuantumCircuitModel, shots: int) -> dict[str, int]:
    """Run shot-based simulation via PennyLane and return a histogram."""
    qnode = build_counts_qnode(circuit, shots)
    try:
        raw = qnode()
    except PennyLaneBuildError:
        raise
    except Exception as exc:
        raise PennyLaneSimulationError(f"PennyLane shot simulation failed: {exc}") from exc

    num_qubits = circuit.qubits
    histogram: dict[str, int] = {}
    for outcome, count in raw.items():
        if isinstance(outcome, int):
            bitstring = format(outcome, f"0{num_qubits}b")
        else:
            bitstring = str(outcome)
        histogram[bitstring] = int(count)

    return histogram


def run_bloch_angles(sv: np.ndarray, num_qubits: int) -> list[dict]:
    return compute_bloch_angles(sv, num_qubits)
