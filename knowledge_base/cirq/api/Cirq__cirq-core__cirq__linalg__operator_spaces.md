---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/linalg/operator_spaces.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/linalg/operator_spaces.py
license: Apache-2.0
---

## Module `cirq-core/cirq/linalg/operator_spaces.py`

Utilities for manipulating linear operators as elements of vector space.

## `kron_bases`

```python
def kron_bases(*bases: dict[str, np.ndarray], repeat: int=1) -> dict[str, np.ndarray]
```

Creates tensor product of bases.

## `hilbert_schmidt_inner_product`

```python
def hilbert_schmidt_inner_product(m1: np.ndarray, m2: np.ndarray) -> complex
```

Computes Hilbert-Schmidt inner product of two matrices.

Linear in second argument.

## `expand_matrix_in_orthogonal_basis`

```python
def expand_matrix_in_orthogonal_basis(m: np.ndarray, basis: dict[str, np.ndarray]) -> value.LinearDict[str]
```

Computes coefficients of expansion of m in basis.

We require that basis be orthogonal w.r.t. the Hilbert-Schmidt inner
product. We do not require that basis be orthonormal. Note that Pauli
basis (I, X, Y, Z) is orthogonal, but not orthonormal.

## `matrix_from_basis_coefficients`

```python
def matrix_from_basis_coefficients(expansion: value.LinearDict[str], basis: dict[str, np.ndarray]) -> np.ndarray
```

Computes linear combination of basis vectors with given coefficients.

## `pow_pauli_combination`

```python
def pow_pauli_combination(ai: cirq.TParamValComplex, ax: cirq.TParamValComplex, ay: cirq.TParamValComplex, az: cirq.TParamValComplex, exponent: int) -> tuple[cirq.TParamValComplex, cirq.TParamValComplex, cirq.TParamValComplex, cirq.TParamValComplex]
```

Computes non-negative integer power of single-qubit Pauli combination.

Returns scalar coefficients bi, bx, by, bz such that

    bi I + bx X + by Y + bz Z = (ai I + ax X + ay Y + az Z)^exponent

Correctness of the formulas below follows from the binomial expansion
and the fact that for any real or complex vector (ax, ay, az) and any
non-negative integer k:

     [ax X + ay Y + az Z]^(2k) = (ax^2 + ay^2 + az^2)^k I
