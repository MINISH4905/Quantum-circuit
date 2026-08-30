---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/density_matrix_utils.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/density_matrix_utils.py
license: Apache-2.0
---

## Module `cirq-core/cirq/sim/density_matrix_utils.py`

Code to handle density matrices.

## `sample_density_matrix`

```python
def sample_density_matrix(density_matrix: np.ndarray, indices: Sequence[int], *, qid_shape: tuple[int, ...] | None=None, repetitions: int=1, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> np.ndarray
```

Samples repeatedly from measurements in the computational basis.

Note that this does not modify the density_matrix.

Args:
    density_matrix: The density matrix to be measured. This matrix is
        assumed to be positive semidefinite and trace one. The matrix is
        assumed to be of shape (2 ** integer, 2 ** integer) or
        (2, 2, ..., 2).
    indices: Which qubits are measured. The density matrix rows and columns
        are assumed to be supplied in big endian order. That is the
        xth index of v, when expressed as a bitstring, has its largest
        values in the 0th index.
    qid_shape: The qid shape of the density matrix.  Specify this argument
        when using qudits.
    repetitions: The number of times to sample the density matrix.
    seed: A seed for the pseudorandom number generator.

Returns:
    Measurement results with True corresponding to the ``|1⟩`` state.
    The outer list is for repetitions, and the inner corresponds to
    measurements ordered by the supplied qubits. These lists
    are wrapped as a numpy ndarray.

Raises:
    ValueError: ``repetitions`` is less than one or size of ``matrix`` is
        not a power of 2.
    IndexError: An index from ``indices`` is out of range, given the number
        of qubits corresponding to the density matrix.

## `measure_density_matrix`

```python
def measure_density_matrix(density_matrix: np.ndarray, indices: Sequence[int], qid_shape: tuple[int, ...] | None=None, out: np.ndarray | None=None, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> tuple[list[int], np.ndarray]
```

Performs a measurement of the density matrix in the computational basis.

This does not modify `density_matrix` unless the optional `out` is
`density_matrix`.

Args:
    density_matrix: The density matrix to be measured. This matrix is
        assumed to be positive semidefinite and trace one. The matrix is
        assumed to be of shape (2 ** integer, 2 ** integer) or
        (2, 2, ..., 2).
    indices: Which qubits are measured. The matrix is assumed to be supplied
        in big endian order. That is the xth index of v, when expressed as
        a bitstring, has the largest values in the 0th index.
    qid_shape: The qid shape of the density matrix.  Specify this argument
        when using qudits.
    out: An optional place to store the result. If `out` is the same as
        the `density_matrix` parameter, then `density_matrix` will be
        modified inline. If `out` is not None, then the result is put into
        `out`.  If `out` is None a new value will be allocated. In all of
        these cases `out` will be the same as the returned ndarray of the
        method. The shape and dtype of `out` will match that of
        `density_matrix` if `out` is None, otherwise it will match the
        shape and dtype of `out`.
    seed: A seed for the pseudorandom number generator.

Returns:
    A tuple of a list and a numpy array. The list is an array of booleans
    corresponding to the measurement values (ordered by the indices). The
    numpy array is the post measurement matrix. This matrix has the same
    shape and dtype as the input matrix.

Raises:
    ValueError if the dimension of the matrix is not compatible with a
        matrix of n qubits.
    IndexError if the indices are out of range for the number of qubits
        corresponding to the density matrix.
