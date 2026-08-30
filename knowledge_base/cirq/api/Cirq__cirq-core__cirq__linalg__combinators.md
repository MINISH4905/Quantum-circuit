---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/linalg/combinators.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/linalg/combinators.py
license: Apache-2.0
---

## Module `cirq-core/cirq/linalg/combinators.py`

Utility methods for combining matrices.

## `kron`

```python
def kron(*factors: np.ndarray | complex, shape_len: int=2) -> np.ndarray
```

Computes the kronecker product of a sequence of values.

A *args version of lambda args: functools.reduce(np.kron, args).

Args:
    *factors: The matrices, tensors, and/or scalars to combine together
        using np.kron.
    shape_len: The expected number of dimensions in the output. Mainly
        determines the behavior of the empty kron product.

Returns:
    The kronecker product of all the inputs.

## `kron_with_controls`

```python
def kron_with_controls(*factors: np.ndarray | complex) -> np.ndarray
```

Computes the kronecker product of a sequence of values and control tags.

Use `cirq.CONTROL_TAG` to represent controls. Any entry of the output
corresponding to a situation where the control is not satisfied will
be overwritten by identity matrix elements.

The control logic works by imbuing NaN with the meaning "failed to meet one
or more controls". The normal kronecker product then spreads the per-item
NaNs to all the entries in the product that need to be replaced by identity
matrix elements. This method rewrites those NaNs. Thus CONTROL_TAG can be
the matrix [[NaN, 0], [0, 1]] or equivalently [[NaN, NaN], [NaN, 1]].

Because this method re-interprets NaNs as control-failed elements, it won't
propagate error-indicating NaNs from its input to its output in the way
you'd otherwise expect.

Examples:

    ```
    result = cirq.kron_with_controls(
        cirq.CONTROL_TAG,
        cirq.unitary(cirq.X))
    print(result.astype(np.int32))

    # prints:
    # [[1 0 0 0]
    #  [0 1 0 0]
    #  [0 0 0 1]
    #  [0 0 1 0]]
    ```

Args:
    *factors: The matrices, tensors, scalars, and/or control tags to combine
        together using np.kron.

Returns:
    The resulting matrix.

## `dot`

```python
def dot(*values: ArrayLike) -> np.ndarray
```

Computes the dot/matrix product of a sequence of values.

Performs the computation in serial order without regard to the matrix
sizes.  If you are using this for matrices of large and differing sizes,
consider using np.lingalg.multi_dot for better performance.

Args:
    *values: The values to combine with the dot/matrix product.

Returns:
    The resulting value or matrix.

Raises:
    ValueError: If the method is called without any arguments.

## `block_diag`

```python
def block_diag(*blocks: np.ndarray) -> np.ndarray
```

Concatenates blocks into a block diagonal matrix.

Args:
    *blocks: Square matrices to place along the diagonal of the result.

Returns:
    A block diagonal matrix with the given blocks along its diagonal.

Raises:
    ValueError: A block isn't square.
