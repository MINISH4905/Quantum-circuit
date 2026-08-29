"""
Framework-independent Bloch angle computation from a raw statevector array.

Shared by all three backend simulators (Qiskit Aer, Cirq, PennyLane).
"""

from __future__ import annotations

import math

import numpy as np

PURITY_THRESHOLD = 0.999


def compute_bloch_angles(statevector: np.ndarray, num_qubits: int) -> list[dict]:
    """
    Reduced single-qubit Bloch vector for each qubit, via partial trace of the
    full statevector's density matrix. For an entangled qubit the reduced
    state is mixed (Bloch vector length r < 1); below PURITY_THRESHOLD we
    report theta/phi as None rather than a misleading point on the sphere.
    """
    sv = np.asarray(statevector, dtype=complex).ravel()
    full_dm = np.outer(sv, sv.conj())

    angles: list[dict] = []

    for q in range(num_qubits):
        reduced = _partial_trace_single(full_dm, q, num_qubits)

        rx = 2 * reduced[0, 1].real
        ry = -2 * reduced[0, 1].imag
        rz = (reduced[0, 0] - reduced[1, 1]).real
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


def _partial_trace_single(dm: np.ndarray, keep_qubit: int, num_qubits: int) -> np.ndarray:
    """Partial trace of a density matrix, keeping only `keep_qubit`."""
    if num_qubits == 1:
        return dm

    dim = 2 ** num_qubits
    reduced = np.zeros((2, 2), dtype=complex)

    for i in range(dim):
        for j in range(dim):
            bit_i = (i >> (num_qubits - 1 - keep_qubit)) & 1
            bit_j = (j >> (num_qubits - 1 - keep_qubit)) & 1
            rest_i = _clear_bit(i, num_qubits - 1 - keep_qubit)
            rest_j = _clear_bit(j, num_qubits - 1 - keep_qubit)
            if rest_i == rest_j:
                reduced[bit_i, bit_j] += dm[i, j]

    return reduced


def _clear_bit(value: int, bit_pos: int) -> int:
    """Clear a specific bit and compact the remaining bits."""
    upper = (value >> (bit_pos + 1)) << bit_pos
    lower = value & ((1 << bit_pos) - 1)
    return upper | lower
