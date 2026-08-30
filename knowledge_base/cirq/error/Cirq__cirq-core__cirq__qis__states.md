---
framework: cirq
api_version: v1.7.0
doc_type: error
source_path: cirq-core/cirq/qis/states.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/qis/states.py
license: Apache-2.0
---

## Error surface of `cirq-core/cirq/qis/states.py`

### Validation

### `QuantumState.validate`

```python
def validate(self, *, dtype: DTypeLike | None=None, atol=1e-07) -> None
```

Check if this quantum state is valid.

Args:
    dtype: The expected data type of the quantum state.
    atol: Absolute numerical tolerance to use for validation.

Raises:
    ValueError: Invalid quantum state.

## `validate_normalized_state_vector`

```python
def validate_normalized_state_vector(state_vector: np.ndarray, *, qid_shape: tuple[int, ...], dtype: DTypeLike | None=None, atol: float=1e-07) -> None
```

Checks that the given state vector is valid.

Args:
    state_vector: The state vector to validate.
    qid_shape: The expected qid shape of the state.
    dtype: The expected dtype of the state.
    atol: Absolute numerical tolerance.

Raises:
    ValueError: State has invalid dtype.
    ValueError: State has incorrect size.
    ValueError: State is not normalized.

## `validate_qid_shape`

```python
def validate_qid_shape(state_vector: np.ndarray, qid_shape: tuple[int, ...] | None) -> tuple[int, ...]
```

Validates the size of the given `state_vector` against the given shape.

Returns:
    The qid shape.

Raises:
    ValueError: if the size of `state_vector` does not match that given in
        `qid_shape`, or if `qid_shape` is not given and `state_vector` does
        not have a dimension that is a power of two.

## `validate_indices`

```python
def validate_indices(num_qubits: int, indices: Sequence[int]) -> None
```

Validates that the indices have values within range of num_qubits.

## `validate_density_matrix`

```python
def validate_density_matrix(density_matrix: np.ndarray, *, qid_shape: tuple[int, ...], dtype: DTypeLike | None=None, atol: float=1e-07) -> None
```

Checks that the given density matrix is valid.

Args:
    density_matrix: The density matrix to validate.
    qid_shape: The expected qid shape.
    dtype: The expected dtype.
    atol: Absolute numerical tolerance.

Raises:
    ValueError: The density matrix does not have the correct dtype.
    ValueError: The density matrix does not have the correct shape.
        It should be a square matrix with dimension prod(qid_shape).
    ValueError: The density matrix is not Hermitian.
    ValueError: The density matrix does not have trace 1.
    ValueError: The density matrix is not positive semidefinite.
