---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/linalg/diagonalize.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/linalg/diagonalize.py
license: Apache-2.0
---

## Module `cirq-core/cirq/linalg/diagonalize.py`

Utility methods for diagonalizing matrices.

## `diagonalize_real_symmetric_matrix`

```python
def diagonalize_real_symmetric_matrix(matrix: np.ndarray, *, rtol: float=1e-05, atol: float=1e-08, check_preconditions: bool=True) -> np.ndarray
```

Returns an orthogonal matrix that diagonalizes the given matrix.

Args:
    matrix: A real symmetric matrix to diagonalize.
    rtol: Relative error tolerance.
    atol: Absolute error tolerance.
    check_preconditions: If set, verifies that the input matrix is real and
        symmetric.

Returns:
    An orthogonal matrix P such that P.T @ matrix @ P is diagonal.

Raises:
    ValueError: Matrix isn't real symmetric.

## `diagonalize_real_symmetric_and_sorted_diagonal_matrices`

```python
def diagonalize_real_symmetric_and_sorted_diagonal_matrices(symmetric_matrix: np.ndarray, diagonal_matrix: np.ndarray, *, rtol: float=1e-05, atol: float=1e-08, check_preconditions: bool=True) -> np.ndarray
```

Returns an orthogonal matrix that diagonalizes both given matrices.

The given matrices must commute.
Guarantees that the sorted diagonal matrix is not permuted by the
diagonalization (except for nearly-equal values).

Args:
    symmetric_matrix: A real symmetric matrix.
    diagonal_matrix: A real diagonal matrix with entries along the diagonal
        sorted into descending order.
    rtol: Relative numeric error threshold.
    atol: Absolute numeric error threshold.
    check_preconditions: If set, verifies that the input matrices commute
        and are respectively symmetric and diagonal descending.

Returns:
    An orthogonal matrix P such that P.T @ symmetric_matrix @ P is diagonal
    and P.T @ diagonal_matrix @ P = diagonal_matrix (up to tolerance).

Raises:
    ValueError: Matrices don't meet preconditions (e.g. not symmetric).

## `bidiagonalize_real_matrix_pair_with_symmetric_products`

```python
def bidiagonalize_real_matrix_pair_with_symmetric_products(mat1: np.ndarray, mat2: np.ndarray, *, rtol: float=1e-05, atol: float=1e-08, check_preconditions: bool=True) -> tuple[np.ndarray, np.ndarray]
```

Finds orthogonal matrices that diagonalize both mat1 and mat2.

Requires mat1 and mat2 to be real.
Requires mat1.T @ mat2 to be symmetric.
Requires mat1 @ mat2.T to be symmetric.

Args:
    mat1: One of the real matrices.
    mat2: The other real matrix.
    rtol: Relative numeric error threshold.
    atol: Absolute numeric error threshold.
    check_preconditions: If set, verifies that the inputs are real, and that
        mat1.T @ mat2 and mat1 @ mat2.T are both symmetric. Defaults to set.

Returns:
    A tuple (L, R) of two orthogonal matrices, such that both L @ mat1 @ R
    and L @ mat2 @ R are diagonal matrices.

Raises:
    ValueError: Matrices don't meet preconditions (e.g. not real).

## `bidiagonalize_unitary_with_special_orthogonals`

```python
def bidiagonalize_unitary_with_special_orthogonals(mat: np.ndarray, *, rtol: float=1e-05, atol: float=1e-08, check_preconditions: bool=True) -> tuple[np.ndarray, np.ndarray, np.ndarray]
```

Finds orthogonal matrices L, R such that L @ matrix @ R is diagonal.

Args:
    mat: A unitary matrix.
    rtol: Relative numeric error threshold.
    atol: Absolute numeric error threshold.
    check_preconditions: If set, verifies that the input is a unitary matrix
        (to the given tolerances). Defaults to set.

Returns:
    A triplet (L, d, R) such that L @ mat @ R = diag(d). Both L and R will
    be orthogonal matrices with determinant equal to 1.

Raises:
    ValueError: Matrices don't meet preconditions (e.g. not real).
