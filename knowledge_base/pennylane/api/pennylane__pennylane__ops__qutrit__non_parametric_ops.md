---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/qutrit/non_parametric_ops.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/qutrit/non_parametric_ops.py
license: Apache-2.0
---

## Module `pennylane/ops/qutrit/non_parametric_ops.py`

This submodule contains the qutrit quantum operations
that do not depend on any parameters.

## `TShift`

```python
class TShift(Operation)
```

TShift(wires)
The qutrit shift operator

The construction of this operator is based on equation 1 from
`Yeh et al. (2022) <https://arxiv.org/abs/2204.00552>`_.

.. math:: TShift = \begin{bmatrix}
                    0 & 0 & 1 \\
                    1 & 0 & 0 \\
                    0 & 1 & 0
                \end{bmatrix}

**Details:**

* Number of wires: 1
* Number of parameters: 0

Args:
    wires (Sequence[int] or int): the wire the operation acts on

### `compute_matrix`

```python
def compute_matrix()
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.TShift.matrix`

Returns:
    ndarray: matrix

**Example**

>>> print(qp.TShift.compute_matrix())
[[0 0 1]
 [1 0 0]
 [0 1 0]]

### `compute_eigvals`

```python
def compute_eigvals()
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.TShift.eigvals`

Returns:
    array: eigenvalues

**Example**

>>> print(qp.TShift.compute_eigvals())
[-0.5+0.8660254j -0.5-0.8660254j  1. +0.j       ]

## `TClock`

```python
class TClock(Operation)
```

TClock(wires)
Ternary Clock gate

The construction of this operator is based on equation 1 from
`Yeh et al. (2022) <https://arxiv.org/abs/2204.00552>`_.

.. math:: TClock = \begin{bmatrix}
                    1 & 0      & 0        \\
                    0 & \omega & 0        \\
                    0 & 0      & \omega^2
                \end{bmatrix}

where :math:`\omega = e^{2 \pi i / 3}`.

**Details:**

* Number of wires: 1
* Number of parameters: 0

Args:
    wires (Sequence[int] or int): the wire the operation acts on

### `compute_matrix`

```python
def compute_matrix()
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.TClock.matrix`

Returns:
    ndarray: matrix

**Example**

>>> print(qp.TClock.compute_matrix())
[[ 1. +0.j         0. +0.j         0. +0.j       ]
 [ 0. +0.j        -0.5+0.8660254j  0. +0.j       ]
 [ 0. +0.j         0. +0.j        -0.5-0.8660254j]]

### `compute_eigvals`

```python
def compute_eigvals()
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.
Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.TClock.eigvals`

Returns:
    array: eigenvalues

**Example**

>>> print(qp.TClock.compute_eigvals())
[ 1. +0.j        -0.5+0.8660254j -0.5-0.8660254j]

## `TAdd`

```python
class TAdd(Operation)
```

TAdd(wires)
The 2-qutrit controlled add gate

The construction of this operator is based on definition 7 from
`Yeh et al. (2022) <https://arxiv.org/abs/2204.00552>`_.
It performs the controlled :class:`~.TShift` operation, and sends
:math:`\hbox{TAdd} \vert i \rangle \vert j \rangle = \vert i \rangle \vert i + j \rangle`,
where addition is taken modulo 3. The matrix representation is

.. math:: TAdd = \begin{bmatrix}
                    1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
                    0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
                    0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\
                    0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 \\
                    0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 \\
                    0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 \\
                    0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 \\
                    0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 \\
                    0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 & 0
                \end{bmatrix}

.. note:: The first wire provided corresponds to the **control qutrit**.

**Details:**

* Number of wires: 2
* Number of parameters: 0

Args:
    wires (Sequence[int]): the wires the operation acts on

### `compute_matrix`

```python
def compute_matrix()
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.TAdd.matrix`

Returns:
    ndarray: matrix

**Example**

>>> print(qp.TAdd.compute_matrix())
[[1 0 0 0 0 0 0 0 0]
 [0 1 0 0 0 0 0 0 0]
 [0 0 1 0 0 0 0 0 0]
 [0 0 0 0 0 1 0 0 0]
 [0 0 0 1 0 0 0 0 0]
 [0 0 0 0 1 0 0 0 0]
 [0 0 0 0 0 0 0 1 0]
 [0 0 0 0 0 0 0 0 1]
 [0 0 0 0 0 0 1 0 0]]

### `compute_eigvals`

```python
def compute_eigvals()
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.
Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.TAdd.eigvals`

Returns:
    array: eigenvalues

**Example**

>>> print(qp.TAdd.compute_eigvals())
[-0.5+0.8660254j -0.5-0.8660254j  1. +0.j        -0.5+0.8660254j -0.5-0.8660254j  1. +0.j         1. +0.j         1. +0.j         1. +0.j       ]

## `TSWAP`

```python
class TSWAP(Operation)
```

TSWAP(wires)
The ternary swap operator.

This operation is analogous to the qubit SWAP and acts on two-qutrit computational basis states
according to :math:`TSWAP\vert i, j\rangle = \vert j, i \rangle`. Its matrix representation is

.. math:: TSWAP = \begin{bmatrix}
            1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
            0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 \\
            0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 \\
            0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
            0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 \\
            0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 \\
            0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\
            0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 \\
            0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 \\
        \end{bmatrix}

**Details:**

* Number of wires: 2
* Number of parameters: 0

Args:
    wires (Sequence[int]): the wires the operation acts on

### `compute_matrix`

```python
def compute_matrix()
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.TSWAP.matrix`

Returns:
    ndarray: matrix

**Example**

>>> print(qp.TSWAP.compute_matrix())
[[1 0 0 0 0 0 0 0 0]
 [0 0 0 1 0 0 0 0 0]
 [0 0 0 0 0 0 1 0 0]
 [0 1 0 0 0 0 0 0 0]
 [0 0 0 0 1 0 0 0 0]
 [0 0 0 0 0 0 0 1 0]
 [0 0 1 0 0 0 0 0 0]
 [0 0 0 0 0 1 0 0 0]
 [0 0 0 0 0 0 0 0 1]]

### `compute_eigvals`

```python
def compute_eigvals()
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.
Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.TSWAP.eigvals`

Returns:
    array: eigenvalues

**Example**

>>> print(qp.TSWAP.compute_eigvals())
[ 1. -1.  1. -1.  1. -1.  1.  1.  1.]

## `THadamard`

```python
class THadamard(Operation)
```

THadamard(wires, subspace)
The ternary Hadamard operator

Performs the Hadamard operation on a 2D subspace, if specified. The subspace is
given as a keyword argument and determines which two of three single-qutrit basis states the
operation applies to. When a subspace is not specified, the generalized Hadamard operation
is used.

The construction of this operator is based on section 2 of
`Di et al. (2012) <https://arxiv.org/abs/1105.5485>`_ when the subspace is specified, and
definition 4 and equation 5 from `Yeh et al. (2022) <https://arxiv.org/abs/2204.00552>`_
when no subspace is specified. The operator definition of the ``subspace=None`` case is

.. math:: \text{THadamard} = \frac{-i}{\sqrt{3}}\begin{bmatrix}
                1 & 1 & 1 \\
                1 & \omega & \omega^2 \\
                1 & \omega^2 & \omega \\
            \end{bmatrix}

where :math:`\omega = \exp(2 \pi i / 3)`.

**Details:**

* Number of wires: 1
* Number of parameters: 0

Args:
    wires (Sequence[int] or int): the wire the operation acts on
    subspace (Optional[Sequence[int]]): the 2D subspace on which to apply the operation.
        This should be `None` for the generalized Hadamard.

**Example**

The specified subspace will determine which basis states the operation actually
applies to:

>>> qp.THadamard(wires=0, subspace=(0, 1)).matrix()
array([[ 0.70710678+0.j,  0.70710678+0.j,  0.        +0.j],
       [ 0.70710678+0.j, -0.70710678+0.j,  0.        +0.j],
       [ 0.        +0.j,  0.        +0.j,  1.        +0.j]])

>>> qp.THadamard(wires=0, subspace=(0, 2)).matrix()
array([[ 0.70710678+0.j,  0.        +0.j,  0.70710678+0.j],
       [ 0.        +0.j,  1.        +0.j,  0.        +0.j],
       [ 0.70710678+0.j,  0.        +0.j, -0.70710678+0.j]])

>>> qp.THadamard(wires=0, subspace=(1, 2)).matrix()
array([[ 1.        +0.j,  0.        +0.j,  0.        +0.j],
       [ 0.        +0.j,  0.70710678+0.j,  0.70710678+0.j],
       [ 0.        +0.j,  0.70710678+0.j, -0.70710678+0.j]])

>>> qp.THadamard(wires=0, subspace=None).matrix()
array([[ 0. -0.57735027j,  0. -0.57735027j,  0. -0.57735027j],
       [ 0. -0.57735027j,  0.5+0.28867513j, -0.5+0.28867513j],
       [ 0. -0.57735027j, -0.5+0.28867513j,  0.5+0.28867513j]])

### `subspace`

```python
def subspace(self)
```

The single-qutrit basis states which the operator acts on

This property returns the 2D subspace on which the operator acts if specified,
or None if no subspace is defined. This subspace determines which two single-qutrit
basis states the operator acts on. The remaining basis state is not affected by the
operator.

Returns:
    tuple[int] or None: subspace on which operator acts, if specified, else None

### `compute_matrix`

```python
def compute_matrix(subspace=None)
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.THadamard.matrix`

Args:
    subspace (Sequence[int]): the 2D subspace on which to apply operation. This should be
    `None` for the generalized Hadamard.

Returns:
    ndarray: matrix

**Example**

>>> print(qp.THadamard.compute_matrix(subspace=(0, 2)))
[[ 0.70710678+0.j  0.        +0.j  0.70710678+0.j]
 [ 0.        +0.j  1.        +0.j  0.        +0.j]
 [ 0.70710678+0.j  0.        +0.j -0.70710678+0.j]]
