---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/qis/states.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/qis/states.py
license: Apache-2.0
---

## Module `cirq-core/cirq/qis/states.py`

Classes and methods for quantum states.

## `QuantumState`

```python
class QuantumState
```

A quantum state.

Can be a state vector, a state tensor, or a density matrix.

### `__init__`

```python
def __init__(self, data: np.ndarray, qid_shape: tuple[int, ...] | None=None, *, dtype: DTypeLike | None=None, validate: bool=True, atol: float=1e-07) -> None
```

Initialize a quantum state object.

Args:
    data: The data representing the quantum state.
    qid_shape: The qid shape.
    validate: Whether to check if the given data and qid shape
        represent a valid quantum state with the given dtype.
    dtype: The expected data type of the quantum state.
    atol: Absolute numerical tolerance to use for validation.

Raises:
    ValueError: The qid shape was not specified and could not be
        inferred.
    ValueError: Invalid quantum state.

### `data`

```python
def data(self) -> np.ndarray
```

The data underlying the quantum state.

### `qid_shape`

```python
def qid_shape(self) -> tuple[int, ...]
```

The qid shape of the quantum state.

### `dtype`

```python
def dtype(self) -> np.dtype
```

The data type of the quantum state.

### `state_vector`

```python
def state_vector(self) -> np.ndarray | None
```

Return the state vector of this state.

A state vector stores the amplitudes of a pure state as a
one-dimensional array.
If the state is a density matrix, this method returns None.

### `state_tensor`

```python
def state_tensor(self) -> np.ndarray | None
```

Return the state tensor of this state.

A state tensor stores the amplitudes of a pure state as an array with
shape equal to the qid shape of the state.
If the state is a density matrix, this method returns None.

### `density_matrix`

```python
def density_matrix(self) -> np.ndarray
```

Return the density matrix of this state.

A density matrix stores the entries of a density matrix as a matrix
(a two-dimensional array).

### `state_vector_or_density_matrix`

```python
def state_vector_or_density_matrix(self) -> np.ndarray
```

Return the state vector or density matrix of this state.

If the state is a density matrix, return the density matrix. Otherwise, return the state
vector.

### `validate`

```python
def validate(self, *, dtype: DTypeLike | None=None, atol=1e-07) -> None
```

Check if this quantum state is valid.

Args:
    dtype: The expected data type of the quantum state.
    atol: Absolute numerical tolerance to use for validation.

Raises:
    ValueError: Invalid quantum state.

## `quantum_state`

```python
def quantum_state(state: cirq.QUANTUM_STATE_LIKE, qid_shape: tuple[int, ...] | None=None, *, copy: bool=False, validate: bool=True, dtype: DTypeLike | None=None, atol: float=1e-07) -> QuantumState
```

Create a QuantumState object from a state-like object.

Args:
    state: The state-like object.
    qid_shape: The qid shape.
    copy: Whether to copy the data underlying the state.
    validate: Whether to check if the given data and qid shape
        represent a valid quantum state with the given dtype.
    dtype: The desired data type.
    atol: Absolute numerical tolerance to use for validation.

Raises:
    ValueError: Invalid quantum state.
    ValueError: The qid shape was not specified and could not be inferred.

## `density_matrix`

```python
def density_matrix(state: np.ndarray, qid_shape: tuple[int, ...] | None=None, *, copy: bool=False, validate: bool=True, dtype: DTypeLike | None=None, atol: float=1e-07) -> QuantumState
```

Create a QuantumState object from a density matrix.

Args:
    state: The density matrix.
    qid_shape: The qid shape.
    copy: Whether to copy the density matrix.
    validate: Whether to check if the given data and qid shape
        represent a valid quantum state with the given dtype.
    dtype: The expected data type.
    atol: Absolute numerical tolerance to use for validation.

Raises:
    ValueError: Invalid density matrix.

## `infer_qid_shape`

```python
def infer_qid_shape(*states: cirq.QUANTUM_STATE_LIKE) -> tuple[int, ...]
```

Infer the qid shape of a set of states.

This is a heuristic to determine a qid shape compatible with all of the
given states. It works by attempting to find the intersection of the sets
of potential qid shapes for each given state. It may fail (raising an
error) even if there is a unique compatible qid shape. If the dimension of
a state vector or density matrix (but not state tensor) is a power of 2,
then the state space is assumed to be composed of qubits; otherwise, it is
assumed to be composed of a single qudit. If the qid shape is ambiguous,
an error is raised.

Args:
    *states: The states for which to infer the qid shape.

Returns:
    The inferred qid shape.

Raises:
    ValueError: The qid shape of the given states is ambiguous.
    ValueError: Failed to infer the qid shape of the given states.

## `bloch_vector_from_state_vector`

```python
def bloch_vector_from_state_vector(state_vector: np.ndarray, index: int, qid_shape: tuple[int, ...] | None=None) -> np.ndarray
```

Returns the bloch vector of a qubit.

Calculates the bloch vector of the qubit at index in the state vector,
assuming state vector follows the standard Kronecker convention of
numpy.kron.

Args:
    state_vector: A sequence representing a state vector in which
        the ordering mapping to qubits follows the standard Kronecker
        convention of numpy.kron (big-endian).
    index: index of qubit whose bloch vector we want to find.
        follows the standard Kronecker convention of numpy.kron.
    qid_shape: specifies the dimensions of the qudits for the input
        `state_vector`.  If not specified, qubits are assumed and the
        `state_vector` must have a dimension a power of two.
        The qudit at `index` must be a qubit.

Returns:
    A length 3 numpy array representing the qubit's bloch vector.

Raises:
    ValueError: if the size of `state_vector `is not a power of 2 and the
        shape is not given or if the shape is given and `state_vector` has
        a size that contradicts this shape.
    IndexError: if index is out of range for the number of qubits or qudits
        corresponding to `state_vector`.

## `density_matrix_from_state_vector`

```python
def density_matrix_from_state_vector(state_vector: np.ndarray, indices: Iterable[int] | None=None, qid_shape: tuple[int, ...] | None=None) -> np.ndarray
```

Returns the density matrix of the state vector.

Calculate the density matrix for the system on the given qubit indices,
with the qubits not in indices that are present in state vector traced out.
If indices is None the full density matrix for `state_vector` is returned.
We assume `state_vector` follows the standard Kronecker convention of
numpy.kron (big-endian).

For example:
state_vector = np.array([1/np.sqrt(2), 1/np.sqrt(2)], dtype=np.complex64)
indices = None
gives us

    $$
    \rho = \begin{bmatrix}
            0.5 & 0.5 \\
            0.5 & 0.5
    \end{bmatrix}
    $$

Args:
    state_vector: A sequence representing a state vector in which
        the ordering mapping to qubits follows the standard Kronecker
        convention of numpy.kron (big-endian).
    indices: list containing indices for qubits that you would like
        to include in the density matrix (i.e.) qubits that WON'T
        be traced out. follows the standard Kronecker convention of
        numpy.kron.
    qid_shape: specifies the dimensions of the qudits for the input
        `state_vector`.  If not specified, qubits are assumed and the
        `state_vector` must have a dimension a power of two.

Returns:
    A numpy array representing the density matrix.

Raises:
    ValueError: if the size of `state_vector` is not a power of 2 and the
        shape is not given or if the shape is given and `state_vector`
        has a size that contradicts this shape.
    IndexError: if the indices are out of range for the number of qubits
        corresponding to `state_vector`.

## `dirac_notation`

```python
def dirac_notation(state_vector: np.ndarray, decimals: int=2, qid_shape: tuple[int, ...] | None=None) -> str
```

Returns the state vector as a string in Dirac notation.

For example:

>>> state_vector = np.array([1/np.sqrt(2), 1/np.sqrt(2)], dtype=np.complex64)
>>> print(cirq.dirac_notation(state_vector))
0.71|0⟩ + 0.71|1⟩


Args:
    state_vector: A sequence representing a state vector in which
        the ordering mapping to qubits follows the standard Kronecker
        convention of numpy.kron (big-endian).
    decimals: How many decimals to include in the pretty print.
    qid_shape: specifies the dimensions of the qudits for the input
        `state_vector`.  If not specified, qubits are assumed and the
        `state_vector` must have a dimension a power of two.

Returns:
    A pretty string consisting of a sum of computational basis kets
    and non-zero floats of the specified accuracy.

Raises:
    ValueError: If there is a shape mismatch between state_vector and qid_shape.
        Otherwise, when qid_shape is not mentioned and length of state_vector
        is not a power of 2.

## `to_valid_state_vector`

```python
def to_valid_state_vector(state_rep: cirq.STATE_VECTOR_LIKE, num_qubits: int | None=None, *, qid_shape: Sequence[int] | None=None, dtype: DTypeLike | None=None, atol: float=1e-07) -> np.ndarray
```

Verifies the state_rep is valid and converts it to ndarray form.

This method is used to support passing in an integer representing a
computational basis state or a full state vector as a representation of
a pure state.

Args:
    state_rep: If an int, the state vector returned is the state vector
        corresponding to a computational basis state. If a numpy array
        this is the full state vector. Both of these are validated for
        the given number of qubits, and the state must be properly
        normalized and of the appropriate dtype.
    num_qubits: The number of qubits for the state vector. The state_rep
        must be valid for this number of qubits.
    qid_shape: The expected qid shape of the state vector. Specify this
        argument when using qudits.
    dtype: The numpy dtype of the state vector, will be used when creating
        the state for a computational basis state, or validated against if
        state_rep is a numpy array.
    atol: Numerical tolerance for verifying that the norm of the state
        vector is close to 1.

Returns:
    A numpy ndarray corresponding to the state vector on the given number of
    qubits.

Raises:
    ValueError: if `state_vector` is not valid or
        num_qubits != len(qid_shape).

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

## `to_valid_density_matrix`

```python
def to_valid_density_matrix(density_matrix_rep: np.ndarray | cirq.STATE_VECTOR_LIKE, num_qubits: int | None=None, *, qid_shape: tuple[int, ...] | None=None, dtype: DTypeLike | None=None, atol: float=1e-07) -> np.ndarray
```

Verifies the density_matrix_rep is valid and converts it to ndarray form.

This method is used to support passing a matrix, a state vector,
or a computational basis state as a representation of a state.

Args:
    density_matrix_rep: If a numpy array, if it is of rank 2 (a matrix),
        then this is the density matrix. If it is a numpy array of rank 1
        (a vector) then this is a state vector. If this is an int,
        then this is the computation basis state.
    num_qubits: The number of qubits for the density matrix. The
        density_matrix_rep must be valid for this number of qubits.
    qid_shape: The qid shape of the state vector. Specify this argument
        when using qudits.
    dtype: The numpy dtype of the density matrix, will be used when creating
        the state for a computational basis state (int), or validated
        against if density_matrix_rep is a numpy array.
    atol: Numerical tolerance for verifying density matrix properties.

Returns:
    A numpy matrix corresponding to the density matrix on the given number
    of qubits. Note that this matrix may share memory with the input
    `density_matrix_rep`.

Raises:
    ValueError if the density_matrix_rep is not valid.

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

## `one_hot`

```python
def one_hot(*, index: None | int | Sequence[int]=None, shape: int | Sequence[int], value: Any=1, dtype: DTypeLike) -> np.ndarray
```

Returns a numpy array with all 0s and a single non-zero entry(default 1).

Args:
    index: The index that should store the `value` argument instead of 0.
        If not specified, defaults to the start of the array.
    shape: The shape of the array.
    value: The hot value to place at `index` in the result.
    dtype: The dtype of the array.

Returns:
    The created numpy array.

## `eye_tensor`

```python
def eye_tensor(half_shape: tuple[int, ...], *, dtype: DTypeLike) -> np.ndarray
```

Returns an identity matrix reshaped into a tensor.

Args:
    half_shape: A tuple representing the number of quantum levels of each
        qubit the returned matrix applies to.  `half_shape` is (2, 2, 2) for
        a three-qubit identity operation tensor.
    dtype: The numpy dtype of the new array.

Returns:
    The created numpy array with shape `half_shape + half_shape`.
