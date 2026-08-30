---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/analytical_decompositions/two_qubit_to_cz.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/two_qubit_to_cz.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/analytical_decompositions/two_qubit_to_cz.py`

Utility methods for decomposing two-qubit unitaries into CZ gates.

## `two_qubit_matrix_to_cz_operations`

```python
def two_qubit_matrix_to_cz_operations(q0: cirq.Qid, q1: cirq.Qid, mat: np.ndarray, allow_partial_czs: bool, atol: float=1e-08, clean_operations: bool=True) -> list[ops.Operation]
```

Decomposes a two-qubit operation into Z/XY/CZ gates.

Args:
    q0: The first qubit being operated on.
    q1: The other qubit being operated on.
    mat: Defines the operation to apply to the pair of qubits.
    allow_partial_czs: Enables the use of Partial-CZ gates.
    atol: A limit on the amount of absolute error introduced by the
        construction.
    clean_operations: Enables optimizing resulting operation list by
        merging operations and ejecting phased Paulis and Z operations.

Returns:
    A list of operations implementing the matrix.

Raises:
    ValueError: If allow_partial_czs=False and the matrix requires partial CZs.

## `two_qubit_matrix_to_diagonal_and_cz_operations`

```python
def two_qubit_matrix_to_diagonal_and_cz_operations(q0: cirq.Qid, q1: cirq.Qid, mat: np.ndarray, allow_partial_czs: bool=False, atol: float=1e-08, clean_operations: bool=True) -> tuple[np.ndarray, list[cirq.Operation]]
```

Decomposes a 2-qubit unitary to a diagonal and the remaining operations.

For a 2-qubit unitary V, return ops, a list of operations and
D diagonal unitary, so that:
    V = cirq.Circuit(ops) @ D

Args:
    q0: The first qubit being operated on.
    q1: The other qubit being operated on.
    mat: the input unitary
    allow_partial_czs: Enables the use of Partial-CZ gates.
    atol: A limit on the amount of absolute error introduced by the
        construction.
    clean_operations: Enables optimizing resulting operation list by
        merging operations and ejecting phased Paulis and Z operations.
Returns:
    A tuple `(D, ops)` where `D` is the diagonal matrix and `ops` the list of operations.
