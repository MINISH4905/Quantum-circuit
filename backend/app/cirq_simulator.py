"""
Execution layer for Google Cirq: statevector simulation, shot-based counts,
and Bloch angles.
"""

from __future__ import annotations

import numpy as np
import cirq

from .cirq_builder import build_statevector_circuit, build_counts_circuit, CirqBuildError
from .bloch import compute_bloch_angles
from .models import QuantumCircuitModel


class CirqSimulationError(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


def run_statevector(circuit: QuantumCircuitModel) -> np.ndarray:
    """Run statevector simulation via cirq.Simulator and return the state as a numpy array."""
    cirq_circuit, qubits = build_statevector_circuit(circuit)
    try:
        simulator = cirq.Simulator()
        result = simulator.simulate(cirq_circuit, qubit_order=qubits)
        return np.array(result.final_state_vector)
    except CirqBuildError:
        raise
    except Exception as exc:
        raise CirqSimulationError(f"Cirq statevector simulation failed: {exc}") from exc


def run_counts(circuit: QuantumCircuitModel, shots: int) -> dict[str, int]:
    """Run shot-based simulation via cirq.Simulator and return a histogram."""
    cirq_circuit, qubits = build_counts_circuit(circuit)
    try:
        simulator = cirq.Simulator()
        result = simulator.run(cirq_circuit, repetitions=shots)
    except CirqBuildError:
        raise
    except Exception as exc:
        raise CirqSimulationError(f"Cirq shot simulation failed: {exc}") from exc

    histogram: dict[str, int] = {}
    measurement_keys = sorted(result.measurements.keys())
    for rep in range(shots):
        bits = []
        for key in measurement_keys:
            bits.append(str(result.measurements[key][rep][0]))
        bitstring = "".join(bits)
        histogram[bitstring] = histogram.get(bitstring, 0) + 1

    return histogram


def run_bloch_angles(sv: np.ndarray, num_qubits: int) -> list[dict]:
    return compute_bloch_angles(sv, num_qubits)
