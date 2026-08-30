---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/analytical_decompositions/quantum_shannon_decomposition.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/quantum_shannon_decomposition.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/analytical_decompositions/quantum_shannon_decomposition.py`

Utility methods for decomposing arbitrary n-qubit (2^n x 2^n) unitary.

Based on:
Synthesis of Quantum Logic Circuits. Tech. rep. 2006,
https://arxiv.org/abs/quant-ph/0406176

## `quantum_shannon_decomposition`

```python
def quantum_shannon_decomposition(qubits: Sequence[cirq.Qid], u: np.ndarray, atol: float=1e-08) -> Iterable[cirq.Operation]
```

Decomposes n-qubit unitary 1-q, 2-q and GlobalPhase gates, preserving global phase.

The gates used are CX/YPow/ZPow/CNOT/GlobalPhase/CZ/PhasedXZGate/PhasedXPowGate.

The algorithm is described in Shende et al.:
Synthesis of Quantum Logic Circuits. Tech. rep. 2006,
https://arxiv.org/abs/quant-ph/0406176

Note: Shannon decomposition is sensitive to the numerical accuracy of doing eigendecomposition.
    Eigendecomposition is obtained using `np.linalg.eig` and the resulting difference between
    the input and output unitary is heavily affected by the accuracy of `np.linalg.eig`.


Args:
    qubits: List of qubits in order of significance
    u: Numpy array for unitary matrix representing gate to be decomposed
    atol: Absolute tolerance of floating point checks.

Calls:
    (Base Case)
    1. _single_qubit_decomposition
        OR
    (Recursive Case)
    1. _recursive_decomposition

Yields:
    A single 2-qubit or 1-qubit operations from OP TREE
    composed from the set
       { CNOT, CZ, rz, ry, ZPowGate }

Raises:
    ValueError: If the u matrix is non-unitary
    ValueError: If the u matrix is not of shape (2^n,2^n)
