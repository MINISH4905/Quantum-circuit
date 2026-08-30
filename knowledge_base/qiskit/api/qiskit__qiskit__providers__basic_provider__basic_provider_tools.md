---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/providers/basic_provider/basic_provider_tools.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/providers/basic_provider/basic_provider_tools.py
license: Apache-2.0
---

## Module `qiskit/providers/basic_provider/basic_provider_tools.py`

Contains functions used by the basic provider simulators.

## `single_gate_matrix`

```python
def single_gate_matrix(gate: str, params: list[float] | None=None) -> np.ndarray
```

Get the matrix for a single qubit.

Args:
    gate: the single qubit gate name
    params: the operation parameters op['params']
Returns:
    array: A numpy array representing the matrix
Raises:
    QiskitError: If a gate outside the supported set is passed in for the
        ``Gate`` argument.

## `einsum_matmul_index`

```python
def einsum_matmul_index(gate_indices: list[int], number_of_qubits: int) -> str
```

Return the index string for Numpy.einsum matrix-matrix multiplication.

The returned indices are to perform a matrix multiplication A.B where
the matrix A is an M-qubit matrix, matrix B is an N-qubit matrix, and
M <= N, and identity matrices are implied on the subsystems where A has no
support on B.

Args:
    gate_indices (list[int]): the indices of the right matrix subsystems
                               to contract with the left matrix.
    number_of_qubits (int): the total number of qubits for the right matrix.

Returns:
    str: An indices string for the Numpy.einsum function.

## `einsum_vecmul_index`

```python
def einsum_vecmul_index(gate_indices: list[int], number_of_qubits: int) -> str
```

Return the index string for Numpy.einsum matrix-vector multiplication.

The returned indices are to perform a matrix multiplication A.v where
the matrix A is an M-qubit matrix, vector v is an N-qubit vector, and
M <= N, and identity matrices are implied on the subsystems where A has no
support on v.

Args:
    gate_indices (list[int]): the indices of the right matrix subsystems
                              to contract with the left matrix.
    number_of_qubits (int): the total number of qubits for the right matrix.

Returns:
    str: An indices string for the Numpy.einsum function.
