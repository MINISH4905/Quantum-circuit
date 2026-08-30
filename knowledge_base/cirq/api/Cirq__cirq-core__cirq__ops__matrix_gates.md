---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/matrix_gates.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/matrix_gates.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/matrix_gates.py`

Quantum gates defined by a matrix.

## `MatrixGate`

```python
class MatrixGate(raw_types.Gate)
```

A unitary qubit or qudit gate defined entirely by its numpy matrix.

For example `cirq.MatrixGate(np.array([[0, 1j], [1, 0]]))` has the unitary matrix:

$$
\begin{bmatrix}
    0 & i \\
    1 & 0
\end{bmatrix}
$$

### `__init__`

```python
def __init__(self, matrix: np.ndarray, *, name: str | None=None, qid_shape: Iterable[int] | None=None, unitary_check: bool=True, unitary_check_rtol: float=1e-05, unitary_check_atol: float=1e-08) -> None
```

Initializes a matrix gate.

Args:
    matrix: The matrix that defines the gate.
    name: The optional name of the gate to be displayed.
    qid_shape: The shape of state tensor that the matrix applies to.
        If not specified, this value is inferred by assuming that the
        matrix is supposed to apply to qubits.
    unitary_check: If True, check that the supplied matrix is unitary up to the
        given tolerances. This should only be disabled if the matrix has already been
        checked for unitarity, in which case we get a slight performance improvement by
        not checking again.
    unitary_check_rtol: The relative tolerance for checking whether the supplied matrix
        is unitary. See `cirq.is_unitary`.
    unitary_check_atol: The absolute tolerance for checking whether the supplied matrix
        is unitary. See `cirq.is_unitary`.

Raises:
    ValueError: If the matrix is not a square numpy array, if the matrix does not match
        the `qid_shape`, if `qid_shape` is not supplied and the matrix dimension is
        not a power of 2, or if the matrix not unitary (to the supplied precisions).

### `with_name`

```python
def with_name(self, name: str) -> MatrixGate
```

Creates a new MatrixGate with the same matrix and a new name.
