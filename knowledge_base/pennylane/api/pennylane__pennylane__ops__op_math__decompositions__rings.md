---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/decompositions/rings.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/decompositions/rings.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/decompositions/rings.py`

This module provides classes for algebraic prerequisites for Clifford+T decompositions

## `ZSqrtTwo`

```python
class ZSqrtTwo
```

Represents the elements of the ring of integers adjoined with the square root of 2.

..math::
    \mathbb{Z}[\sqrt{2}] = \{ a + b\sqrt{2} \mid a, b \in \mathbb{Z} \}

Args:
    a (int): The integer part of the element.
    b (int): The coefficient of sqrt(2) in the element.

### `flatten`

```python
def flatten(self: ZSqrtTwo) -> list[int]
```

Flatten to a list.

### `conj`

```python
def conj(self) -> ZSqrtTwo
```

Return the complex conjugate.

.. math::
    (a + b\sqrt{2})^{\dagger} = a + b\sqrt{2}

### `adj2`

```python
def adj2(self) -> ZSqrtTwo
```

Return the adjoint, i.e., the root-2 conjugate.

.. math::
    (a + b\sqrt{2})^{\bullet} = a - b\sqrt{2}

### `sqrt`

```python
def sqrt(self) -> ZSqrtTwo | None
```

Return the square root.

### `to_omega`

```python
def to_omega(self) -> ZOmega
```

Convert to the an ring of integers adjoined with omega.

## `ZOmega`

```python
class ZOmega
```

Represents the elements of the ring of integers adjoined with :math:`\omega`, the eight root of unity.

..math::
    \mathbb{Z}[\omega] = \{ a\omega^3 + b\omega^2 + c\omega + d \mid a, b, c, d \in \mathbb{Z} \}

where :math:`\omega = (1 + i) / \sqrt{2}` is the eighth root of unity.

Args:
    a (int): Coefficient of :math:`\omega^3`.
    b (int): Coefficient of :math:`\omega^2`.
    c (int): Coefficient of :math:`\omega`.
    d (int): Constant term.

### `from_sqrt_pair`

```python
def from_sqrt_pair(cls, alpha: ZSqrtTwo, beta: ZSqrtTwo, shift: ZOmega) -> ZOmega
```

Return ``ZOmega`` element as :math:`A + 1j * B + shift`, where :math:`A` and
:math:`B` are ``ZSqrtTwo`` elements and ``shift`` is ``ZOmega`` element.

### `flatten`

```python
def flatten(self: ZOmega) -> list[int]
```

Flatten to a list.

### `conj`

```python
def conj(self: ZOmega) -> ZOmega
```

Return the complex conjugate.

.. math::
    (a\omega^3 + b\omega^2 + c\omega + d)^{\dagger} = -c\omega^3 + b\omega^2 - a\omega + d

### `adj2`

```python
def adj2(self: ZOmega) -> ZOmega
```

Return the adjoint, i.e., the root-2 conjugate.

.. math::
    (a\omega^3 + b\omega^2 + c\omega + d)^{\bullet} = -a\omega^3 + b\omega^2 - c\omega + d

### `norm`

```python
def norm(self: ZOmega) -> float
```

Return the norm squared.

### `parity`

```python
def parity(self: ZOmega) -> int
```

Return the parity indicating structure of real and imaginary parts as a DyadicMatrix element.

### `to_sqrt_two`

```python
def to_sqrt_two(self: ZOmega) -> ZSqrtTwo
```

Convert to the ring of integers adjoined with the square root of 2.

Returns:
    ZSqrtTwo: The corresponding element in the ZSqrtTwo ring.

### `normalize`

```python
def normalize(self: ZOmega) -> tuple[ZOmega, int]
```

Normalize the ZOmega element and return the number of times 2 was factored out.

## `DyadicMatrix`

```python
class DyadicMatrix
```

Represents the matrices over the ring :math:`\mathbb{D}[\omega]`,
the ring of dyadic fractions adjoined with :math:`\omega`.

The dyadic fractions :math:`\mathbb{D} = \mathbb{Z}[\frac{1}{2}]` are defined as
:math:`\mathbb{D} = \{ a / 2^k \mid a \in \mathbb{Z}, k \in  \{0\} \cup \mathbb{N}\}`. This gives:

.. math::
    \mathbb{D}[omega] = \mathbb{Z}[\frac{1}{\sqrt{2}}, i] = \{ a\omega^3 + b\omega^2 + c\omega + d \mid a, b, c, d \in \mathbb{Z}[\frac{1}{\sqrt{2}}] \}

The `~pennylane.ZOmega` (or :math:`\mathbb{Z}[\omega]) represents a subset of :math:`\mathbb{D}[\omega]`,
and therefore can be used to construct the elements of a ``DyadicMatrix``, which is represented as:

.. math::
    \frac{1}{\sqrt{2}^k}
    \begin{pmatrix}
    a_{00} & a_{01} \\
    a_{10} & a_{11}
    \end{pmatrix},

where :math:`a_{ij} \in \mathbb{D}[\omega]` and :math:`k \in \mathbb{Z}`.

Args:
    a (ZOmega): Element at position (0, 0) of the matrix.
    b (ZOmega): Element at position (0, 1) of the matrix.
    c (ZOmega): Element at position (1, 0) of the matrix.
    d (ZOmega): Element at position (1, 1) of the matrix.
    k (int): Optional integer to scale the matrix by a factor of :math:`1 / \sqrt{2}^k`.

### `__eq__`

```python
def __eq__(self: DyadicMatrix, other: DyadicMatrix) -> bool
```

Check if two dyadic matrices are equal.

### `__mul__`

```python
def __mul__(self: DyadicMatrix, other: int | ZOmega) -> DyadicMatrix
```

Multiply the matrix by an integer.

### `__add__`

```python
def __add__(self: DyadicMatrix, other: int | float | complex | DyadicMatrix) -> DyadicMatrix
```

Add two dyadic matrices.

### `__matmul__`

```python
def __matmul__(self: DyadicMatrix, other: DyadicMatrix) -> DyadicMatrix
```

Multiply two dyadic matrices.

### `ndarray`

```python
def ndarray(self: DyadicMatrix) -> np.ndarray
```

Convert the matrix to a NumPy array.

### `flatten`

```python
def flatten(self: DyadicMatrix) -> list[ZOmega]
```

Flatten the matrix elements to a list.

### `conj`

```python
def conj(self: DyadicMatrix) -> DyadicMatrix
```

Return the conjugate of the matrix.

### `adj2`

```python
def adj2(self: DyadicMatrix) -> DyadicMatrix
```

Return the root-2 adjoint of the matrix.

### `mult2k`

```python
def mult2k(self: DyadicMatrix, k: int) -> DyadicMatrix
```

Multiply the matrix by :math:`2^k`, i.e., an integer power of 2.

### `normalize`

```python
def normalize(self: DyadicMatrix) -> None
```

Reduce the k value of the dyadic matrix.

Example:
    >>> A = DyadicMatrix(ZOmega(d=2), ZOmega(d=2), ZOmega(d=2), ZOmega(d=2), k = 4)
    >>> A.normalize()
    >>> A
    DyadicMatrix(a=1, b=1, c=1, d=1, k=2)

## `SO3Matrix`

```python
class SO3Matrix
```

Represents the :math:`SO(3)` matrices over the ring :math:`\mathbb{D}[\sqrt{2}]`,
the ring of dyadic integers adjoined with :math:`\sqrt{2}`.

The `~pennylane.ZSqrtTwo` (or :math:`\mathbb{Z}[\sqrt{2}]) represents a subset of this ring,
and can be used to construct its elements. The matrix form is usually represented as:

.. math::

    \frac{1}{\sqrt{2}^k}
    \begin{pmatrix}
    a_{00} & a_{01} & a_{11} \\
    a_{10} & a_{11} & a_{12} \\
    a_{20} & a_{21} & a_{22}
    \end{pmatrix},

where :math:`a_{ij} \in \mathbb{Z}[\sqrt{2}]` and :math:`k \in \mathbb{Z}`.

Args:
    matrix (DyadicMatrix): The :class:`~pennylane.DyadicMatrix` matrix from which the :math:`SO(3)` matrix is derived.

### `__init__`

```python
def __init__(self, matrix: DyadicMatrix) -> None
```

Initialize the SO(3) matrix with a dyadic matrix and an integer k.

### `__str__`

```python
def __str__(self: SO3Matrix) -> str
```

Return a string representation of the SO(3) matrix.

### `__repr__`

```python
def __repr__(self: SO3Matrix) -> str
```

Return a string representation of the SO(3) matrix.

### `flatten`

```python
def flatten(self: SO3Matrix) -> list[ZOmega]
```

Flatten the matrix to a 1D NumPy array.

### `ndarray`

```python
def ndarray(self: SO3Matrix) -> np.ndarray
```

Convert the matrix to a NumPy array.

### `parity_mat`

```python
def parity_mat(self: SO3Matrix) -> np.ndarray
```

Return the parity of the SO(3) matrix.

### `parity_vec`

```python
def parity_vec(self: SO3Matrix) -> np.ndarray
```

Return the permutation vector of the SO(3) matrix.

### `from_matrix`

```python
def from_matrix(self, matrix: DyadicMatrix) -> list[list[ZSqrtTwo]]
```

Return the SO(3) matrix as a list of lists.

### `normalize`

```python
def normalize(self: SO3Matrix) -> None
```

Reduce the k value of the SO(3) matrix.

Example:
    >>> A = DyadicMatrix(ZOmega(d=2), ZOmega(d=2), ZOmega(d=2), ZOmega(d=2), k = 4) * 2
    >>> B = SO3Matrix(A @ A)
    >>> B.normalize()
    >>> B
    SO3Matrix(matrix=[[1, 1], [1, 1]], k=-6)
