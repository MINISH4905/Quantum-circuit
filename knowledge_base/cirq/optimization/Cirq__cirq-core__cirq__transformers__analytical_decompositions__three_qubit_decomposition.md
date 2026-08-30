---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/analytical_decompositions/three_qubit_decomposition.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/three_qubit_decomposition.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/analytical_decompositions/three_qubit_decomposition.py`

Utility methods for decomposing three-qubit unitaries.

## `three_qubit_matrix_to_operations`

```python
def three_qubit_matrix_to_operations(q0: ops.Qid, q1: ops.Qid, q2: ops.Qid, u: np.ndarray, atol: float=1e-08) -> list[ops.Operation]
```

Returns operations for a 3 qubit unitary.

The algorithm is described in Shende et al.:
Synthesis of Quantum Logic Circuits. Tech. rep. 2006,
https://arxiv.org/abs/quant-ph/0406176

Args:
    q0: first qubit
    q1: second qubit
    q2: third qubit
    u: unitary matrix
    atol: A limit on the amount of absolute error introduced by the
        construction.

Returns:
    The resulting operations will have only known two-qubit and one-qubit
    gates based operations, namely CZ, CNOT and rx, ry, PhasedXPow gates.

Raises:
    ValueError: If the u matrix is non-unitary or not of shape (8,8).
