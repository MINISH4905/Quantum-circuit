---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/unitary/aqc/fast_gradient/pmatrix.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/unitary/aqc/fast_gradient/pmatrix.py
license: Apache-2.0
---

## Module `qiskit/synthesis/unitary/aqc/fast_gradient/pmatrix.py`

Matrix designed for fast multiplication by permutation and block-diagonal ones.

## `PMatrix`

```python
class PMatrix
```

Wrapper around a matrix that enables fast multiplication by permutation
matrices and block-diagonal ones.

### `__init__`

```python
def __init__(self, num_qubits: int)
```

Initializes the internal structures of this object but does not set
the matrix yet.

Args:
    num_qubits: number of qubits.

### `set_matrix`

```python
def set_matrix(self, mat: np.ndarray)
```

Copies specified matrix to internal storage. Once the matrix
is set, the object is ready for use.

**Note**, the matrix will be copied, mind the size issues.

Args:
    mat: matrix we want to multiply on the left and on the right by
         layer matrices.

### `mul_right_q1`

```python
def mul_right_q1(self, layer: Layer1Q, temp_mat: np.ndarray, dagger: bool)
```

Multiplies ``NxN`` matrix, wrapped by this object, by a 1-qubit layer
matrix on the right, where ``N`` is the actual size of matrices involved,
``N = 2^{num. of qubits}``.

Args:
    layer: 1-qubit layer, i.e. the layer with just one non-trivial
           1-qubit gate and other gates are just identity operators.
    temp_mat: a temporary NxN matrix used as a workspace.
    dagger: if true, the right-hand side matrix will be taken as
            conjugate transposed.

### `mul_right_q2`

```python
def mul_right_q2(self, layer: Layer2Q, temp_mat: np.ndarray, dagger: bool=True)
```

Multiplies ``NxN`` matrix, wrapped by this object, by a 2-qubit layer
matrix on the right, where ``N`` is the actual size of matrices involved,
``N = 2^{num. of qubits}``.

Args:
    layer: 2-qubit layer, i.e. the layer with just one non-trivial
           2-qubit gate and other gates are just identity operators.
    temp_mat: a temporary NxN matrix used as a workspace.
    dagger: if true, the right-hand side matrix will be taken as
            conjugate transposed.

### `mul_left_q1`

```python
def mul_left_q1(self, layer: Layer1Q, temp_mat: np.ndarray)
```

Multiplies ``NxN`` matrix, wrapped by this object, by a 1-qubit layer
matrix on the left, where ``dim`` is the actual size of matrices involved,
``dim = 2^{num. of qubits}``.

Args:
    layer: 1-qubit layer, i.e. the layer with just one non-trivial
           1-qubit gate and other gates are just identity operators.
    temp_mat: a temporary NxN matrix used as a workspace.

### `mul_left_q2`

```python
def mul_left_q2(self, layer: Layer2Q, temp_mat: np.ndarray)
```

Multiplies ``NxN`` matrix, wrapped by this object, by a 2-qubit layer
matrix on the left, where ``dim`` is the actual size of matrices involved,
``dim = 2^{num. of qubits}``.

Args:
    layer: 2-qubit layer, i.e. the layer with just one non-trivial
           2-qubit gate and other gates are just identity operators.
    temp_mat: a temporary NxN matrix used as a workspace.

### `product_q1`

```python
def product_q1(self, layer: Layer1Q, tmp1: np.ndarray, tmp2: np.ndarray) -> np.complex128
```

Computes and returns: ``Trace(mat @ C) = Trace(mat @ P^T @ gmat @ P) =
Trace((P @ mat @ P^T) @ gmat) = Trace(C @ (P @ mat @ P^T)) =
vec(gmat^T)^T @ vec(P @ mat @ P^T)``, where mat is ``NxN`` matrix wrapped
by this object, ``C`` is matrix representation of the layer ``L``, and gmat
is 2x2 matrix of underlying 1-qubit gate.

**Note**: matrix of this class must be finalized beforehand.

Args:
    layer: 1-qubit layer.
    tmp1: temporary, external matrix used as a workspace.
    tmp2: temporary, external matrix used as a workspace.

Returns:
    trace of the matrix product.

### `product_q2`

```python
def product_q2(self, layer: Layer2Q, tmp1: np.ndarray, tmp2: np.ndarray) -> np.complex128
```

Computes and returns: ``Trace(mat @ C) = Trace(mat @ P^T @ gmat @ P) =
Trace((P @ mat @ P^T) @ gmat) = Trace(C @ (P @ mat @ P^T)) =
vec(gmat^T)^T @ vec(P @ mat @ P^T)``, where mat is ``NxN`` matrix wrapped
by this object, ``C`` is matrix representation of the layer ``L``, and gmat
is 4x4 matrix of underlying 2-qubit gate.

**Note**: matrix of this class must be finalized beforehand.

Args:
    layer: 2-qubit layer.
    tmp1: temporary, external matrix used as a workspace.
    tmp2: temporary, external matrix used as a workspace.

Returns:
    trace of the matrix product.

### `finalize`

```python
def finalize(self, temp_mat: np.ndarray) -> np.ndarray
```

Applies the left (row) and right (column) permutations to the matrix.
at the end of computation process.

Args:
    temp_mat: temporary, external matrix.

Returns:
    finalized matrix with all transformations applied.
