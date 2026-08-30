---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/state_vector.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/state_vector.py
license: Apache-2.0
---

## Module `cirq-core/cirq/sim/state_vector.py`

Helpers for handling quantum state vectors.

## `StateVectorMixin`

```python
class StateVectorMixin
```

A mixin that provide methods for objects that have a state vector.

### `__init__`

```python
def __init__(self, qubit_map: Mapping[cirq.Qid, int] | None=None, *args, **kwargs)
```

Inits StateVectorMixin.

Args:
    qubit_map: A map from the Qubits in the Circuit to the index
        of this qubit for a canonical ordering. This canonical ordering
        is used to define the state (see the state_vector() method).
    *args: Passed on to the class that this is mixed in with.
    **kwargs: Passed on to the class that this is mixed in with.

### `state_vector`

```python
def state_vector(self, copy: bool=False) -> np.ndarray
```

Return the state vector (wave function).

The vector is returned in the computational basis with these basis
states defined by the `qubit_map`. In particular the value in the
`qubit_map` is the index of the qubit, and these are translated into
binary vectors where the last qubit is the 1s bit of the index, the
second-to-last is the 2s bit of the index, and so forth (i.e. big
endian ordering).

Example:
     qubit_map: {QubitA: 0, QubitB: 1, QubitC: 2}
     Then the returned vector will have indices mapped to qubit basis
     states like the following table

        |     | QubitA | QubitB | QubitC |
        | :-: | :----: | :----: | :----: |
        |  0  |   0    |   0    |   0    |
        |  1  |   0    |   0    |   1    |
        |  2  |   0    |   1    |   0    |
        |  3  |   0    |   1    |   1    |
        |  4  |   1    |   0    |   0    |
        |  5  |   1    |   0    |   1    |
        |  6  |   1    |   1    |   0    |
        |  7  |   1    |   1    |   1    |

Args:
    copy: If True, the returned state vector will be a copy of that
    stored by the object. This is potentially expensive for large
    state vectors, but prevents mutation of the object state, e.g. for
    operating on intermediate states of a circuit.
    Defaults to False.

### `dirac_notation`

```python
def dirac_notation(self, decimals: int=2) -> str
```

Returns the state vector as a string in Dirac notation.

Args:
    decimals: How many decimals to include in the pretty print.

Returns:
    A pretty string consisting of a sum of computational basis kets
    and non-zero floats of the specified accuracy.

### `density_matrix_of`

```python
def density_matrix_of(self, qubits: Sequence[cirq.Qid] | None=None) -> np.ndarray
```

Returns the density matrix of the state.

Calculate the density matrix for the system on the qubits provided.
Any qubits not in the list that are present in self.state_vector() will
be traced out. If qubits is None, the full density matrix for
self.state_vector() is returned, given self.state_vector() follows
standard Kronecker convention of numpy.kron.

For example, if `self.state_vector()` returns
`np.array([1/np.sqrt(2), 1/np.sqrt(2)], dtype=np.complex64)`,
then `density_matrix_of(qubits = None)` gives us

$$
\rho = \begin{bmatrix}
            0.5 & 0.5 \\
            0.5 & 0.5
        \end{bmatrix}
$$

Args:
    qubits: list containing qubit IDs that you would like
        to include in the density matrix (i.e.) qubits that WON'T
        be traced out.

Returns:
    A numpy array representing the density matrix.

Raises:
    ValueError: if the size of the state represents more than 25 qubits.
    KeyError: if some of the qubits provided are not in the quantum state.

### `bloch_vector_of`

```python
def bloch_vector_of(self, qubit: cirq.Qid) -> np.ndarray
```

Returns the bloch vector of a qubit in the state.

Calculates the bloch vector of the given qubit
in the state given by self.state_vector(), given that
self.state_vector() follows the standard Kronecker convention of
numpy.kron.

Args:
    qubit: qubit whose bloch vector we want to find.

Returns:
    A length 3 numpy array representing the qubit's bloch vector.

Raises:
    ValueError: if the size of the state represents more than 25 qubits.
    KeyError: if the specified qubit is not in the quantum state.

## `sample_state_vector`

```python
def sample_state_vector(state_vector: np.ndarray, indices: Sequence[int], *, qid_shape: tuple[int, ...] | None=None, repetitions: int=1, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> np.ndarray
```

Samples repeatedly from measurements in the computational basis.

Note that this does not modify the passed in state.

Args:
    state_vector: The multi-qubit state vector to be sampled. This is an
        array of 2 to the power of the number of qubit complex numbers, and
        so state must be of size ``2**integer``.  The `state_vector` can be
        a vector of size ``2**integer`` or a tensor of shape
        ``(2, 2, ..., 2)``.
    indices: Which qubits are measured. The `state_vector` is assumed to be
        supplied in big endian order. That is the xth index of v, when
        expressed as a bitstring, has its largest values in the 0th index.
    qid_shape: The qid shape of the `state_vector`.  Specify this argument
        when using qudits.
    repetitions: The number of times to sample.
    seed: A seed for the pseudorandom number generator.

Returns:
    Measurement results with True corresponding to the ``|1⟩`` state.
    The outer list is for repetitions, and the inner corresponds to
    measurements ordered by the supplied qubits. These lists
    are wrapped as a numpy ndarray.

Raises:
    ValueError: ``repetitions`` is less than one or size of `state_vector`
        is not a power of 2.
    IndexError: An index from ``indices`` is out of range, given the number
        of qubits corresponding to the state.

## `measure_state_vector`

```python
def measure_state_vector(state_vector: np.ndarray, indices: Sequence[int], *, qid_shape: tuple[int, ...] | None=None, out: np.ndarray | None=None, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> tuple[list[int], np.ndarray]
```

Performs a measurement of the state in the computational basis.

This does not modify `state` unless the optional `out` is `state`.

Args:
    state_vector: The state to be measured. This state vector is assumed to
        be normalized. The state vector must be of size 2 ** integer.  The
        state vector can be of shape (2 ** integer) or (2, 2, ..., 2).
    indices: Which qubits are measured. The `state_vector` is assumed to be
        supplied in big endian order. That is the xth index of v, when
        expressed as a bitstring, has the largest values in the 0th index.
    qid_shape: The qid shape of the `state_vector`.  Specify this argument
        when using qudits.
    out: An optional place to store the result. If `out` is the same as
        the `state_vector` parameter, then `state_vector` will be modified
        inline. If `out` is not None, then the result is put into `out`.
        If `out` is None a new value will be allocated. In all of these
        case out will be the same as the returned ndarray of the method.
        The shape and dtype of `out` will match that of `state_vector` if
        `out` is None, otherwise it will match the shape and dtype of `out`.
    seed: A seed for the pseudorandom number generator.

Returns:
    A tuple of a list and a numpy array. The list is an array of booleans
    corresponding to the measurement values (ordered by the indices). The
    numpy array is the post measurement state vector. This state vector has
    the same shape and dtype as the input `state_vector`.

Raises:
    ValueError if the size of state is not a power of 2.
    IndexError if the indices are out of range for the number of qubits
        corresponding to the state.
