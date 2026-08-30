---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/linalg/predicates.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/linalg/predicates.py
license: Apache-2.0
---

## Module `cirq-core/cirq/linalg/predicates.py`

Utility methods for checking properties of matrices.

## `is_diagonal`

```python
def is_diagonal(matrix: np.ndarray, *, atol: float=1e-08) -> bool
```

Determines if a matrix is approximately diagonal.

A matrix is diagonal if i!=j implies m[i,j]==0.

Args:
    matrix: The matrix to check.
    atol: The per-matrix-entry absolute tolerance on equality.

Returns:
    Whether the matrix is diagonal within the given tolerance.

## `is_hermitian`

```python
def is_hermitian(matrix: np.ndarray, *, rtol: float=1e-05, atol: float=1e-08) -> bool
```

Determines if a matrix is approximately Hermitian.

A matrix is Hermitian if it's square and equal to its adjoint.

Args:
    matrix: The matrix to check.
    rtol: The per-matrix-entry relative tolerance on equality.
    atol: The per-matrix-entry absolute tolerance on equality.

Returns:
    Whether the matrix is Hermitian within the given tolerance.

## `is_orthogonal`

```python
def is_orthogonal(matrix: np.ndarray, *, rtol: float=1e-05, atol: float=1e-08) -> bool
```

Determines if a matrix is approximately orthogonal.

A matrix is orthogonal if it's square and real and its transpose is its
inverse.

Args:
    matrix: The matrix to check.
    rtol: The per-matrix-entry relative tolerance on equality.
    atol: The per-matrix-entry absolute tolerance on equality.

Returns:
    Whether the matrix is orthogonal within the given tolerance.

## `is_special_orthogonal`

```python
def is_special_orthogonal(matrix: np.ndarray, *, rtol: float=1e-05, atol: float=1e-08) -> bool
```

Determines if a matrix is approximately special orthogonal.

A matrix is special orthogonal if it is square and real and its transpose
is its inverse and its determinant is one.

Args:
    matrix: The matrix to check.
    rtol: The per-matrix-entry relative tolerance on equality.
    atol: The per-matrix-entry absolute tolerance on equality.

Returns:
    Whether the matrix is special orthogonal within the given tolerance.

## `is_unitary`

```python
def is_unitary(matrix: np.ndarray, *, rtol: float=1e-05, atol: float=1e-08) -> bool
```

Determines if a matrix is approximately unitary.

A matrix is unitary if it's square and its adjoint is its inverse.

Args:
    matrix: The matrix to check.
    rtol: The per-matrix-entry relative tolerance on equality.
    atol: The per-matrix-entry absolute tolerance on equality.

Returns:
    Whether the matrix is unitary within the given tolerance.

## `is_special_unitary`

```python
def is_special_unitary(matrix: np.ndarray, *, rtol: float=1e-05, atol: float=1e-08) -> bool
```

Determines if a matrix is approximately unitary with unit determinant.

A matrix is special-unitary if it is square and its adjoint is its inverse
and its determinant is one.

Args:
    matrix: The matrix to check.
    rtol: The per-matrix-entry relative tolerance on equality.
    atol: The per-matrix-entry absolute tolerance on equality.
Returns:
    Whether the matrix is unitary with unit determinant within the given
    tolerance.

## `is_normal`

```python
def is_normal(matrix: np.ndarray, *, rtol: float=1e-05, atol: float=1e-08) -> bool
```

Determines if a matrix is approximately normal.

A matrix is normal if it's square and commutes with its adjoint.

Args:
    matrix: The matrix to check.
    rtol: The per-matrix-entry relative tolerance on equality.
    atol: The per-matrix-entry absolute tolerance on equality.

Returns:
    Whether the matrix is normal within the given tolerance.

## `is_cptp`

```python
def is_cptp(*, kraus_ops: Sequence[np.ndarray], rtol: float=1e-05, atol: float=1e-08) -> bool
```

Determines if a channel is completely positive trace preserving (CPTP).

A channel composed of Kraus operators K[0:n] is a CPTP map if the sum of
the products `adjoint(K[i]) * K[i])` is equal to 1.

Args:
    kraus_ops: The Kraus operators of the channel to check.
    rtol: The relative tolerance on equality.
    atol: The absolute tolerance on equality.

## `matrix_commutes`

```python
def matrix_commutes(m1: np.ndarray, m2: np.ndarray, *, rtol: float=1e-05, atol: float=1e-08) -> bool
```

Determines if two matrices approximately commute.

Two matrices A and B commute if they are square and have the same size and
AB = BA.

Args:
    m1: One of the matrices.
    m2: The other matrix.
    rtol: The per-matrix-entry relative tolerance on equality.
    atol: The per-matrix-entry absolute tolerance on equality.

Returns:
    Whether the two matrices have compatible sizes and a commutator equal
    to zero within tolerance.

## `allclose_up_to_global_phase`

```python
def allclose_up_to_global_phase(a: np.ndarray, b: np.ndarray, *, rtol: float=1e-05, atol: float=1e-08, equal_nan: bool=False) -> bool
```

Determines if a ~= b * exp(i t) for some t.

Args:
    a: A numpy array.
    b: Another numpy array.
    rtol: Relative error tolerance.
    atol: Absolute error tolerance.
    equal_nan: Whether or not NaN entries should be considered equal to
        other NaN entries.

## `slice_for_qubits_equal_to`

```python
def slice_for_qubits_equal_to(target_qubit_axes: Sequence[int], little_endian_qureg_value: int=0, *, big_endian_qureg_value: int=0, num_qubits: int | None=None, qid_shape: tuple[int, ...] | None=None) -> tuple[slice | int | EllipsisType, ...]
```

Returns an index corresponding to a desired subset of an np.ndarray.

It is assumed that the np.ndarray's shape is of the form (2, 2, 2, ..., 2).

Example:
    ```python
    # A '4 qubit' tensor with values from 0 to 15.
    r = np.array(range(16)).reshape((2,) * 4)

    # We want to index into the subset where qubit #1 and qubit #3 are ON.
    s = cirq.slice_for_qubits_equal_to([1, 3], 0b11)
    print(s)
    # (slice(None, None, None), 1, slice(None, None, None), 1, Ellipsis)

    # Get that subset. It corresponds to numbers of the form 0b*1*1.
    # where here '*' indicates any possible value.
    print(r[s])
    # [[ 5  7]
    #  [13 15]]
    ```

Args:
    target_qubit_axes: The qubits that are specified by the index bits. All
        other axes of the slice are unconstrained.
    little_endian_qureg_value: An integer whose bits specify what value is
        desired for of the target qubits. The integer is little endian
        w.r.t. the target qubit axes, meaning the low bit of the integer
        determines the desired value of the first targeted qubit, and so
        forth with the k'th targeted qubit's value set to
        bool(qureg_value & (1 << k)).
    big_endian_qureg_value: Same as `little_endian_qureg_value` but big
        endian w.r.t. to target qubit axes, meaning the low bit of the
        integer determines the desired value of the last target qubit, and
        so forth.  Specify exactly one of the `*_qureg_value` arguments.
    num_qubits: If specified the slices will extend all the way up to
        this number of qubits, otherwise if it is None, the final element
        return will be Ellipsis. Optional and defaults to using Ellipsis.
    qid_shape: The qid shape of the state vector being sliced.  Specify this
        instead of `num_qubits` when using qids with dimension != 2.  The
        qureg value is interpreted to store digits with corresponding bases
        packed into an int.

Returns:
    An index object that will slice out a mutable view of the desired subset
    of a tensor.

Raises:
    ValueError: If the `qid_shape` mismatches `num_qubits` or exactly one of
        `little_endian_qureg_value` and `big_endian_qureg_value` is not
        specified.
