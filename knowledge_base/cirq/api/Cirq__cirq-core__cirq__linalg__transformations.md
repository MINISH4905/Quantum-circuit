---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/linalg/transformations.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/linalg/transformations.py
license: Apache-2.0
---

## Module `cirq-core/cirq/linalg/transformations.py`

Utility methods for transforming matrices or vectors.

## `reflection_matrix_pow`

```python
def reflection_matrix_pow(reflection_matrix: np.ndarray, exponent: float) -> np.ndarray
```

Raises a matrix with two opposing eigenvalues to a power.

Args:
    reflection_matrix: The matrix to raise to a power.
    exponent: The power to raise the matrix to.

Returns:
    The given matrix raised to the given power.

## `match_global_phase`

```python
def match_global_phase(a: np.ndarray, b: np.ndarray) -> tuple[np.ndarray, np.ndarray]
```

Phases the given matrices so that they agree on the phase of one entry.

To maximize precision, the position with the largest entry from one of the
matrices is used when attempting to compute the phase difference between
the two matrices.

Args:
    a: A numpy array.
    b: Another numpy array.

Returns:
    A tuple (a', b') where a' == b' implies a == b*exp(i t) for some t.

## `targeted_left_multiply`

```python
def targeted_left_multiply(left_matrix: np.ndarray, right_target: np.ndarray, target_axes: Sequence[int], out: np.ndarray | None=None) -> np.ndarray
```

Left-multiplies the given axes of the target tensor by the given matrix.

Note that the matrix must have a compatible tensor structure.

For example, if you have an 6-qubit state vector `input_state` with shape
(2, 2, 2, 2, 2, 2), and a 2-qubit unitary operation `op` with shape
(2, 2, 2, 2), and you want to apply `op` to the 5'th and 3'rd qubits
within `input_state`, then the output state vector is computed as follows:

    output_state = cirq.targeted_left_multiply(op, input_state, [5, 3])

This method also works when the right hand side is a matrix instead of a
vector. If a unitary circuit's matrix is `old_effect`, and you append
a CNOT(q1, q4) operation onto the circuit, where the control q1 is the qubit
at offset 1 and the target q4 is the qubit at offset 4, then the appended
circuit's unitary matrix is computed as follows:

    new_effect = cirq.targeted_left_multiply(
        left_matrix=cirq.unitary(cirq.CNOT).reshape((2, 2, 2, 2)),
        right_target=old_effect,
        target_axes=[1, 4])

Args:
    left_matrix: What to left-multiply the target tensor by.
    right_target: A tensor to carefully broadcast a left-multiply over.
    target_axes: Which axes of the target are being operated on.
    out: The buffer to store the results in. If not specified or None, a new
        buffer is used. Must have the same shape as right_target.

Returns:
    The output tensor.

Raises:
    ValueError: If `out` is either `right_target` or `left_matrix`.

## `targeted_conjugate_about`

```python
def targeted_conjugate_about(tensor: np.ndarray, target: np.ndarray, indices: Sequence[int], conj_indices: Sequence[int] | None=None, buffer: np.ndarray | None=None, out: np.ndarray | None=None) -> np.ndarray
```

Conjugates the given tensor about the target tensor.

This method computes a target tensor conjugated by another tensor.
Here conjugate is used in the sense of conjugating by a matrix, i.e.
A conjugated about B is $A B A^\dagger$ where $\dagger$ represents the
conjugate transpose.

Abstractly this compute $A \cdot B \cdot A^\dagger$ where A and B are
multi-dimensional arrays, and instead of matrix multiplication $\cdot$
is a contraction between the given indices (indices for first $\cdot$,
conj_indices for second $\cdot$).

More specifically, this computes:

$$
\sum tensor_{i_0,...,i_{r-1},j_0,...,j_{r-1}} *
    target_{k_0,...,k_{r-1},l_0,...,l_{r-1}} *
    tensor_{m_0,...,m_{r-1},n_0,...,n_{r-1}}^*
$$

where the sum is over indices where $j_s$ = $k_s$ and $s$ is in `indices`
and $l_s$ = $m_s$ and s is in `conj_indices`.

Args:
    tensor: The tensor that will be conjugated about the target tensor.
    target: The tensor that will receive the conjugation.
    indices: The indices which will be contracted between the tensor and
        target.
    conj_indices: The indices which will be contracted between the
        complex conjugate of the tensor and the target. If this is None,
        then these will be the values in indices plus half the number
        of dimensions of the target (`ndim`). This is the most common case
        and corresponds to the case where the target is an operator on
        a n-dimensional tensor product space (here `n` would be `ndim`).
    buffer: A buffer to store partial results in.  If not specified or None,
        a new buffer is used.
    out: The buffer to store the results in. If not specified or None, a new
        buffer is used. Must have the same shape as target.

Returns:
    The result of the conjugation, as a numpy array.

## `apply_matrix_to_slices`

```python
def apply_matrix_to_slices(target: np.ndarray, matrix: np.ndarray, slices: Sequence[_TSlice], *, out: np.ndarray | None=None) -> np.ndarray
```

Left-multiplies an NxN matrix onto N slices of a numpy array.

One example is that the 4x4 matrix of a fractional SWAP gate can be expressed as

$$
\begin{bmatrix}
  1 & & \\
    & X**t & \\
    & & 1 \\
\end{bmatrix}

Where X is the 2x2 Pauli X gate and t is the power of the swap with t=1
being a full swap. X**t is a power of the Pauli X gate's matrix.
Applying the fractional swap is equivalent to applying a fractional X
within the inner 2x2 subspace; the rest of the matrix is identity. This
can be expressed using `apply_matrix_to_slices` as follows:

    def fractional_swap(target):
        assert target.shape == (4,)
        return apply_matrix_to_slices(
            target=target,
            matrix=cirq.unitary(cirq.X**t),
            slices=[1, 2]
        )

Args:
    target: The input array with slices that need to be left-multiplied.
    matrix: The linear operation to apply to the subspace defined by the
        slices.
    slices: The parts of the tensor that correspond to the "vector entries"
        that the matrix should operate on. May be integers or complicated
        multi-dimensional slices into a tensor. The slices must refer to
        non-overlapping sections of the input all with the same shape.
    out: Where to write the output. If not specified, a new numpy array is
        created, with the same shape and dtype as the target, to store the
        output.

Returns:
    The transformed array.

Raises:
    ValueError: If `out` is `target` , or the matrix shaped does not match
        `slices`.

## `partial_trace`

```python
def partial_trace(tensor: np.ndarray, keep_indices: Sequence[int]) -> np.ndarray
```

Takes the partial trace of a given tensor.

The input tensor must have shape `(d_0, ..., d_{k-1}, d_0, ..., d_{k-1})`.
The trace is done over all indices that are not in keep_indices. The
resulting tensor has shape `(d_{i_0}, ..., d_{i_r}, d_{i_0}, ..., d_{i_r})`
where `i_j` is the `j`th element of `keep_indices`.

Args:
    tensor: The tensor to sum over. This tensor must have a shape
        `(d_0, ..., d_{k-1}, d_0, ..., d_{k-1})`.
    keep_indices: Which indices to not sum over. These are only the indices
        of the first half of the tensors indices (i.e. all elements must
        be between `0` and `tensor.ndims / 2 - 1` inclusive).

Raises:
    ValueError: if the tensor is not of the correct shape or the indices
        are not from the first half of valid indices for the tensor.

## `EntangledStateError`

```python
class EntangledStateError(ValueError)
```

Raised when a product state is expected, but an entangled state is provided.

## `partial_trace_of_state_vector_as_mixture`

```python
def partial_trace_of_state_vector_as_mixture(state_vector: np.ndarray, keep_indices: list[int], *, atol: float=1e-08) -> tuple[tuple[float, np.ndarray], ...]
```

Returns a mixture representing a state vector with only some qubits kept.

The input state vector can have any shape, but if it is one-dimensional it
will be interpreted as qubits, since that is the most common case, and fail
if the dimension is not size `2 ** n`. States in the output mixture will
retain the same type of shape as the input state vector.

If the state vector cannot be factored into a pure state over `keep_indices`
then eigendecomposition is used and the output mixture will not be unique.

Args:
    state_vector: The state vector to take the partial trace over.
    keep_indices: Which indices to take the partial trace of the
        state_vector on.
    atol: The tolerance for determining that a factored state is pure.

Returns:
    A single-component mixture in which the factored state vector has
    probability '1' if the partially traced state is pure, or else a
    mixture of the default eigendecomposition of the mixed state's
    partial trace.

Raises:
    ValueError: If the input `state_vector` is one dimension, but that
        dimension size is not a power of two.
    IndexError: If any indexes are out of range.

## `sub_state_vector`

```python
def sub_state_vector(state_vector: np.ndarray, keep_indices: list[int], *, default: np.ndarray | TDefault=RaiseValueErrorIfNotProvided, atol: float=1e-06) -> np.ndarray | TDefault
```

Attempts to factor a state vector into two parts and return one of them.

The input `state_vector` must have shape ``(2,) * n`` or ``(2 ** n)`` where
`state_vector` is expressed over n qubits. The returned array will retain
the same type of shape as the input state vector, either ``(2 ** k)`` or
``(2,) * k`` where k is the number of qubits kept.

If a state vector $|\psi\rangle$ defined on n qubits is an outer product
of kets like  $|\psi\rangle$ = $|x\rangle \otimes |y\rangle$, and
$|x\rangle$ is defined over the subset ``keep_indices`` of k qubits, then
this method will factor $|\psi\rangle$ into $|x\rangle$ and $|y\rangle$ and
return $|x\rangle$. Note that $|x\rangle$ is not unique, because scalar
multiplication may be absorbed by any factor of a tensor product,
$e^{i \theta} |y\rangle \otimes |x\rangle =
|y\rangle \otimes e^{i \theta} |x\rangle$

This method randomizes the global phase of $|x\rangle$ in order to avoid
accidental reliance on the global phase being some specific value.

If the provided `state_vector` cannot be factored into a pure state over
`keep_indices`, the method will fall back to return `default`. If `default`
is not provided, the method will fail and raise EntangledStateError.

Args:
    state_vector: The target state_vector.
    keep_indices: Which indices to attempt to get the separable part of the
        `state_vector` on.
    default: Determines the fallback behavior when `state_vector` doesn't
        have a pure state factorization. If the factored state is not pure
        and `default` is not set, an EntangledStateError is raised. If
        default is set to a value, that value is returned.
    atol: The minimum tolerance for comparing the output state's coherence
        measure to 1.

Returns:
    The state vector expressed over the desired subset of qubits.

Raises:
    ValueError: If the `state_vector` is not of the correct shape or the
        indices are not a valid subset of the input `state_vector`'s
        indices.
    IndexError: If any indexes are out of range.
    EntangledStateError: If the result of factoring is not a pure state and
        `default` is not provided.

## `to_special`

```python
def to_special(u: np.ndarray) -> np.ndarray
```

Converts a unitary matrix to a special unitary matrix.

All unitary matrices u have |det(u)| = 1.
Also for all d dimensional unitary matrix u, and scalar s:
    det(u * s) = det(u) * s^(d)
To find a special unitary matrix from u:
    u * det(u)^{-1/d}

Args:
    u: the unitary matrix
Returns:
    the special unitary matrix

## `state_vector_kronecker_product`

```python
def state_vector_kronecker_product(t1: np.ndarray, t2: np.ndarray) -> np.ndarray
```

Merges two state vectors into a single unified state vector.

The resulting vector's shape will be `t1.shape + t2.shape`.

Args:
    t1: The first state vector.
    t2: The second state vector.
Returns:
    A new state vector representing the unified state.

## `density_matrix_kronecker_product`

```python
def density_matrix_kronecker_product(t1: np.ndarray, t2: np.ndarray) -> np.ndarray
```

Merges two density matrices into a single unified density matrix.

The resulting matrix's shape will be `(t1.shape/2 + t2.shape/2) * 2`. In
other words, if t1 has shape [A,B,C,A,B,C] and t2 has shape [X,Y,Z,X,Y,Z],
the resulting matrix will have shape [A,B,C,X,Y,Z,A,B,C,X,Y,Z].

Args:
    t1: The first density matrix.
    t2: The second density matrix.
Returns:
    A density matrix representing the unified state.

## `factor_state_vector`

```python
def factor_state_vector(t: np.ndarray, axes: Sequence[int], *, validate=True, atol=1e-07) -> tuple[np.ndarray, np.ndarray]
```

Factors a state vector into two independent state vectors.

This function should only be called on state vectors that are known to be
separable, such as immediately after a measurement or reset operation. It
does not verify that the provided state vector is indeed separable, and
will return nonsense results for vectors representing entangled states.

Args:
    t: The state vector to factor.
    axes: The axes to factor out.
    validate: Perform a validation that the density matrix factors cleanly.
    atol: The absolute tolerance for the validation.

Returns:
    A tuple with the `(extracted, remainder)` state vectors, where
    `extracted` means the sub-state vector which corresponds to the axes
    requested, and with the axes in the requested order, and where
    `remainder` means the sub-state vector on the remaining axes, in the
    same order as the original state vector.

Raises:
    EntangledStateError: If the tensor is already in entangled state, and
        the validate flag is set.
    ValueError: If the tensor factorization fails for any other reason.

## `factor_density_matrix`

```python
def factor_density_matrix(t: np.ndarray, axes: Sequence[int], *, validate=True, atol=1e-07) -> tuple[np.ndarray, np.ndarray]
```

Factors a density matrix into two independent density matrices.

This function should only be called on density matrices that are known to
be separable, such as immediately after a measurement or reset operation.
It does not verify that the provided density matrix is indeed separable,
and will return nonsense results for matrices representing entangled
states.

Args:
    t: The density matrix to factor.
    axes: The axes to factor out. Only the left axes should be provided.
        For example, to extract [C,A] from density matrix of shape
        [A,B,C,D,A,B,C,D], `axes` should be [2,0], and the return value
        will be two density matrices ([C,A,C,A], [B,D,B,D]).
    validate: Perform a validation that the density matrix factors cleanly.
    atol: The absolute tolerance for the validation.

Returns:
    A tuple with the `(extracted, remainder)` density matrices, where
    `extracted` means the sub-matrix which corresponds to the axes
    requested, and with the axes in the requested order, and where
    `remainder` means the sub-matrix on the remaining axes, in the same
    order as the original density matrix.

Raises:
    ValueError: If the tensor cannot be factored along the given aces.

## `transpose_state_vector_to_axis_order`

```python
def transpose_state_vector_to_axis_order(t: np.ndarray, axes: Sequence[int]) -> np.ndarray
```

Transposes the axes of a state vector to a specified order.

Args:
    t: The state vector to transpose.
    axes: The desired axis order.
Returns:
    The transposed state vector.

## `transpose_density_matrix_to_axis_order`

```python
def transpose_density_matrix_to_axis_order(t: np.ndarray, axes: Sequence[int]) -> np.ndarray
```

Transposes the axes of a density matrix to a specified order.

Args:
    t: The density matrix to transpose.
    axes: The desired axis order. Only the left axes should be provided.
        For example, to transpose [A,B,C,A,B,C] to [C,B,A,C,B,A], `axes`
        should be [2,1,0].
Returns:
    The transposed density matrix.

## `transpose_flattened_array`

```python
def transpose_flattened_array(t: np.ndarray, shape: Sequence[int], axes: Sequence[int]) -> np.ndarray
```

Transposes a flattened array.

Equivalent to np.transpose(t.reshape(shape), axes).reshape((-1,)).

Args:
    t: flat array.
    shape: the shape of `t` before flattening.
    axes: permutation of range(len(shape)).

Returns:
    Flattened transpose of `t`.

## `can_numpy_support_shape`

```python
def can_numpy_support_shape(shape: Sequence[int]) -> bool
```

Returns whether numpy supports the given shape or not numpy/numpy#5744.

## `phase_delta`

```python
def phase_delta(u1: np.ndarray, u2: np.ndarray) -> complex
```

Calculates the phase delta of two unitaries.

The delta is from u1 to u2. i.e. u1 * phase_delta(u1, u2) == u2.

Assumes but does not verify that inputs are valid unitaries and differ only
by phase.
