---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/predicates.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/predicates.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/predicates.py`

Predicates for operators.

## `is_square_matrix`

```python
def is_square_matrix(mat)
```

Test if an array is a square matrix.

## `is_diagonal_matrix`

```python
def is_diagonal_matrix(mat, rtol=RTOL_DEFAULT, atol=ATOL_DEFAULT)
```

Test if an array is a diagonal matrix

## `is_symmetric_matrix`

```python
def is_symmetric_matrix(op, rtol=RTOL_DEFAULT, atol=ATOL_DEFAULT)
```

Test if an array is a symmetric matrix

## `is_hermitian_matrix`

```python
def is_hermitian_matrix(mat, rtol=RTOL_DEFAULT, atol=ATOL_DEFAULT)
```

Test if an array is a Hermitian matrix

## `is_positive_semidefinite_matrix`

```python
def is_positive_semidefinite_matrix(mat, rtol=RTOL_DEFAULT, atol=ATOL_DEFAULT)
```

Test if a matrix is positive semidefinite

## `is_identity_matrix`

```python
def is_identity_matrix(mat, ignore_phase=False, rtol=RTOL_DEFAULT, atol=ATOL_DEFAULT)
```

Test if an array is an identity matrix.

## `is_unitary_matrix`

```python
def is_unitary_matrix(mat, rtol=RTOL_DEFAULT, atol=ATOL_DEFAULT)
```

Test if an array is a unitary matrix.

## `is_isometry`

```python
def is_isometry(mat, rtol=RTOL_DEFAULT, atol=ATOL_DEFAULT)
```

Test if an array is an isometry.
