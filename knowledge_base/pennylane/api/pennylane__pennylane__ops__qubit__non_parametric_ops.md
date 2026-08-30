---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/qubit/non_parametric_ops.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/qubit/non_parametric_ops.py
license: Apache-2.0
---

## Module `pennylane/ops/qubit/non_parametric_ops.py`

This submodule contains the discrete-variable quantum operations that do
not depend on any parameters.

## `Hadamard`

```python
class Hadamard(Operation)
```

Hadamard(wires)
The Hadamard operator

.. math:: H = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1\\ 1 & -1\end{bmatrix}.

.. seealso:: The equivalent short-form alias :class:`~H`

**Details:**

* Number of wires: 1
* Number of parameters: 0

Args:
    wires (Sequence[int] or int): the wire the operation acts on

### `__repr__`

```python
def __repr__(self) -> str
```

String representation.

### `compute_matrix`

```python
def compute_matrix() -> np.ndarray
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.Hadamard.matrix`

Returns:
    ndarray: matrix

**Example**

>>> print(qp.Hadamard.compute_matrix())
[[ 0.70710678  0.70710678]
 [ 0.70710678 -0.70710678]]

### `compute_eigvals`

```python
def compute_eigvals() -> np.ndarray
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.Hadamard.eigvals`

Returns:
    array: eigenvalues

**Example**

>>> print(qp.Hadamard.compute_eigvals())
[ 1. -1.]

### `compute_diagonalizing_gates`

```python
def compute_diagonalizing_gates(wires: WiresLike) -> list[qp.operation.Operator]
```

Sequence of gates that diagonalize the operator in the computational basis (static method).

Given the eigendecomposition :math:`O = U \Sigma U^{\dagger}` where
:math:`\Sigma` is a diagonal matrix containing the eigenvalues,
the sequence of diagonalizing gates implements the unitary :math:`U^{\dagger}`.

The diagonalizing gates rotate the state into the eigenbasis
of the operator.

.. seealso:: :meth:`~.Hadamard.diagonalizing_gates`.

Args:
    wires (Iterable[Any], Wires): wires that the operator acts on
Returns:
    list[.Operator]: list of diagonalizing gates

**Example**

>>> print(qp.Hadamard.compute_diagonalizing_gates(wires=[0]))
[RY(-0.7853981633974483, wires=[0])]

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.Hadamard.decomposition`.

Args:
    wires (Any, Wires): Wire that the operator acts on.

Returns:
    list[Operator]: decomposition of the operator

**Example:**

>>> print(qp.Hadamard.compute_decomposition(0))
[PhaseShift(1.5707963267948966, wires=[0]),
RX(1.5707963267948966, wires=[0]),
PhaseShift(1.5707963267948966, wires=[0])]

## `PauliX`

```python
class PauliX(Operation)
```

The Pauli X operator

.. math:: \sigma_x = \begin{bmatrix} 0 & 1 \\ 1 & 0\end{bmatrix}.

.. seealso:: The equivalent short-form alias :class:`~X`

**Details:**

* Number of wires: 1
* Number of parameters: 0

Args:
    wires (Sequence[int] or int): the wire the operation acts on

### `__repr__`

```python
def __repr__(self) -> str
```

String representation.

### `compute_matrix`

```python
def compute_matrix() -> np.ndarray
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.X.matrix`


Returns:
    ndarray: matrix

**Example**

>>> print(qp.X.compute_matrix())
[[0 1]
 [1 0]]

### `compute_eigvals`

```python
def compute_eigvals() -> np.ndarray
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.X.eigvals`

Returns:
    array: eigenvalues

**Example**

>>> print(qp.X.compute_eigvals())
[ 1. -1.]

### `compute_diagonalizing_gates`

```python
def compute_diagonalizing_gates(wires: WiresLike) -> list[qp.operation.Operator]
```

Sequence of gates that diagonalize the operator in the computational basis (static method).

Given the eigendecomposition :math:`O = U \Sigma U^{\dagger}` where
:math:`\Sigma` is a diagonal matrix containing the eigenvalues,
the sequence of diagonalizing gates implements the unitary :math:`U^{\dagger}`.

The diagonalizing gates rotate the state into the eigenbasis
of the operator.

.. seealso:: :meth:`~.X.diagonalizing_gates`.

Args:
   wires (Iterable[Any], Wires): wires that the operator acts on
Returns:
   list[.Operator]: list of diagonalizing gates

**Example**

>>> print(qp.X.compute_diagonalizing_gates(wires=[0]))
[H(0)]

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.X.decomposition`.

Args:
    wires (Any, Wires): Wire that the operator acts on.

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> print(qp.X.compute_decomposition(0))
[RX(3.141592653589793, wires=[0]),
GlobalPhase(-1.5707963267948966, wires=[0])]

## `PauliY`

```python
class PauliY(Operation)
```

The Pauli Y operator

.. math:: \sigma_y = \begin{bmatrix} 0 & -i \\ i & 0\end{bmatrix}.

.. seealso:: The equivalent short-form alias :class:`~Y`

**Details:**

* Number of wires: 1
* Number of parameters: 0

Args:
    wires (Sequence[int] or int): the wire the operation acts on

### `__repr__`

```python
def __repr__(self) -> str
```

String representation.

### `compute_matrix`

```python
def compute_matrix() -> np.ndarray
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.Y.matrix`

Returns:
    ndarray: matrix

**Example**

>>> print(qp.Y.compute_matrix())
[[ 0.+0.j -0.-1.j]
 [ 0.+1.j  0.+0.j]]

### `compute_eigvals`

```python
def compute_eigvals() -> np.ndarray
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.Y.eigvals`

Returns:
    array: eigenvalues

**Example**

>>> print(qp.Y.compute_eigvals())
[ 1. -1.]

### `compute_diagonalizing_gates`

```python
def compute_diagonalizing_gates(wires: WiresLike) -> list[qp.operation.Operator]
```

Sequence of gates that diagonalize the operator in the computational basis (static method).

Given the eigendecomposition :math:`O = U \Sigma U^{\dagger}` where
:math:`\Sigma` is a diagonal matrix containing the eigenvalues,
the sequence of diagonalizing gates implements the unitary :math:`U^{\dagger}`.

The diagonalizing gates rotate the state into the eigenbasis
of the operator.

.. seealso:: :meth:`~.Y.diagonalizing_gates`.

Args:
    wires (Iterable[Any], Wires): wires that the operator acts on
Returns:
    list[.Operator]: list of diagonalizing gates

**Example**

>>> print(qp.Y.compute_diagonalizing_gates(wires=[0]))
[Z(0), S(0), H(0)]

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.Y.decomposition`.

Args:
    wires (Any, Wires): Single wire that the operator acts on.

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> print(qp.Y.compute_decomposition(0))
[RY(3.141592653589793, wires=[0]),
GlobalPhase(-1.5707963267948966, wires=[0])]

## `PauliZ`

```python
class PauliZ(Operation)
```

The Pauli Z operator

.. math:: \sigma_z = \begin{bmatrix} 1 & 0 \\ 0 & -1\end{bmatrix}.

.. seealso:: The equivalent short-form alias :class:`~Z`

**Details:**

* Number of wires: 1
* Number of parameters: 0

Args:
    wires (Sequence[int] or int): the wire the operation acts on

### `__repr__`

```python
def __repr__(self) -> str
```

String representation.

### `compute_matrix`

```python
def compute_matrix() -> np.ndarray
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.Z.matrix`

Returns:
    ndarray: matrix

**Example**

>>> print(qp.Z.compute_matrix())
[[ 1  0]
 [ 0 -1]]

### `compute_eigvals`

```python
def compute_eigvals() -> np.ndarray
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.Z.eigvals`

Returns:
    array: eigenvalues

**Example**

>>> print(qp.Z.compute_eigvals())
[ 1. -1.]

### `compute_diagonalizing_gates`

```python
def compute_diagonalizing_gates(wires: WiresLike) -> list[qp.operation.Operator]
```

Sequence of gates that diagonalize the operator in the computational basis (static method).

Given the eigendecomposition :math:`O = U \Sigma U^{\dagger}` where
:math:`\Sigma` is a diagonal matrix containing the eigenvalues,
the sequence of diagonalizing gates implements the unitary :math:`U^{\dagger}`.

The diagonalizing gates rotate the state into the eigenbasis
of the operator.

.. seealso:: :meth:`~.Z.diagonalizing_gates`.

Args:
    wires (Iterable[Any] or Wires): wires that the operator acts on

Returns:
    list[.Operator]: list of diagonalizing gates

**Example**

>>> print(qp.Z.compute_diagonalizing_gates(wires=[0]))
[]

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.Z.decomposition`.

Args:
    wires (Any, Wires): Single wire that the operator acts on.

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> print(qp.Z.compute_decomposition(0))
[PhaseShift(3.141592653589793, wires=[0])]

## `S`

```python
class S(Operation)
```

S(wires)
The single-qubit phase gate

.. math:: S = \begin{bmatrix}
            1 & 0 \\
            0 & i
        \end{bmatrix}.

**Details:**

* Number of wires: 1
* Number of parameters: 0

Args:
    wires (Sequence[int] or int): the wire the operation acts on

### `__repr__`

```python
def __repr__(self) -> str
```

String representation.

### `compute_matrix`

```python
def compute_matrix() -> np.ndarray
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.S.matrix`

Returns:
    ndarray: matrix

**Example**

>>> print(qp.S.compute_matrix())
[[1.+0.j 0.+0.j]
 [0.+0.j 0.+1.j]]

### `compute_eigvals`

```python
def compute_eigvals() -> np.ndarray
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.S.eigvals`

Returns:
    array: eigenvalues

**Example**

>>> print(qp.S.compute_eigvals())
[1.+0.j 0.+1.j]

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.S.decomposition`.

Args:
    wires (Any, Wires): Single wire that the operator acts on.

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> print(qp.S.compute_decomposition(0))
[PhaseShift(1.5707963267948966, wires=[0])]

## `T`

```python
class T(Operation)
```

T(wires)
The single-qubit T gate

.. math:: T = \begin{bmatrix}
            1 & 0 \\
            0 & e^{\frac{i\pi}{4}}
        \end{bmatrix}.

**Details:**

* Number of wires: 1
* Number of parameters: 0

Args:
    wires (Sequence[int] or int): the wire the operation acts on

### `__repr__`

```python
def __repr__(self) -> str
```

String representation.

### `compute_matrix`

```python
def compute_matrix() -> np.ndarray
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.T.matrix`

Returns:
    ndarray: matrix

**Example**

>>> print(qp.T.compute_matrix())
[[1.        +0.j         0.        +0.j        ]
[0.        +0.j         0.70710678+0.70710678j]]

### `compute_eigvals`

```python
def compute_eigvals() -> np.ndarray
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.T.eigvals`

Returns:
    array: eigenvalues

**Example**

>>> print(qp.T.compute_eigvals())
[1.        +0.j         0.70710678+0.70710678j]

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.T.decomposition`.

Args:
    wires (Any, Wires): Single wire that the operator acts on.

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> print(qp.T.compute_decomposition(0))
[PhaseShift(0.7853981633974483, wires=[0])]

## `SX`

```python
class SX(Operation)
```

SX(wires)
The single-qubit Square-Root X operator.

.. math:: SX = \sqrt{X} = \frac{1}{2} \begin{bmatrix}
        1+i &   1-i \\
        1-i &   1+i \\
    \end{bmatrix}.

**Details:**

* Number of wires: 1
* Number of parameters: 0

Args:
    wires (Sequence[int] or int): the wire the operation acts on

### `__repr__`

```python
def __repr__(self) -> str
```

String representation.

### `compute_matrix`

```python
def compute_matrix() -> np.ndarray
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.SX.matrix`

Returns:
    ndarray: matrix

**Example**

>>> print(qp.SX.compute_matrix())
[[0.5+0.5j 0.5-0.5j]
 [0.5-0.5j 0.5+0.5j]]

### `compute_eigvals`

```python
def compute_eigvals() -> np.ndarray
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.SX.eigvals`


Returns:
    array: eigenvalues

**Example**

>>> print(qp.SX.compute_eigvals())
[1.+0.j 0.+1.j]

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.SX.decomposition`.

Args:
    wires (Any, Wires): Single wire that the operator acts on.

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> print(qp.SX.compute_decomposition(0))
[RZ(1.5707963267948966, wires=[0]),
RY(1.5707963267948966, wires=[0]),
RZ(-1.5707963267948966, wires=[0]),
GlobalPhase(-0.7853981633974483, wires=[0])]

## `SWAP`

```python
class SWAP(Operation)
```

SWAP(wires)
The swap operator

.. math:: SWAP = \begin{bmatrix}
        1 & 0 & 0 & 0 \\
        0 & 0 & 1 & 0\\
        0 & 1 & 0 & 0\\
        0 & 0 & 0 & 1
    \end{bmatrix}.

**Details:**

* Number of wires: 2
* Number of parameters: 0

Args:
    wires (Sequence[int]): the wires the operation acts on

### `compute_matrix`

```python
def compute_matrix() -> np.ndarray
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.SWAP.matrix`

Returns:
    ndarray: matrix

**Example**

>>> print(qp.SWAP.compute_matrix())
[[1 0 0 0]
 [0 0 1 0]
 [0 1 0 0]
 [0 0 0 1]]

### `compute_sparse_matrix`

```python
def compute_sparse_matrix(format='csr') -> sparse.spmatrix
```

Sparse Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.SWAP.sparse_matrix`

Returns:
    csr_matrix: matrix

**Example**

>>> print(qp.SWAP.compute_sparse_matrix())
<Compressed Sparse Row sparse matrix of dtype 'int64'
        with 4 stored elements and shape (4, 4)>
  Coords        Values
  (0, 0)        1
  (1, 2)        1
  (2, 1)        1
  (3, 3)        1

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.SWAP.decomposition`.

Args:
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> print(qp.SWAP.compute_decomposition((0,1)))
[CNOT(wires=[0, 1]), CNOT(wires=[1, 0]), CNOT(wires=[0, 1])]

## `ECR`

```python
class ECR(Operation)
```

ECR(wires)

An echoed RZX(:math:`\pi/2`) gate.

.. math:: ECR = {\frac{1}{\sqrt{2}}} \begin{bmatrix}
        0 & 0 & 1 & i \\
        0 & 0 & i & 1 \\
        1 & -i & 0 & 0 \\
        -i & 1 & 0 & 0
    \end{bmatrix}.

**Details:**

* Number of wires: 2
* Number of parameters: 0

Args:
    wires (int): the subsystem the gate acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix() -> np.ndarray
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.ECR.matrix`


Return type: tensor_like

**Example**

>>> from pprint import pprint
>>> pprint(qp.ECR.compute_matrix())
array([[ 0.        +0.j        ,  0.        +0.j        ,
         0.70710678+0.j        ,  0.        +0.70710678j],
       [ 0.        +0.j        ,  0.        +0.j        ,
         0.        +0.70710678j,  0.70710678+0.j        ],
       [ 0.70710678+0.j        , -0.        -0.70710678j,
         0.        +0.j        ,  0.        +0.j        ],
       [-0.        -0.70710678j,  0.70710678+0.j        ,
         0.        +0.j        ,  0.        +0.j        ]])

### `compute_eigvals`

```python
def compute_eigvals() -> np.ndarray
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.ECR.eigvals`


Returns:
    array: eigenvalues

**Example**

>>> print(qp.ECR.compute_eigvals())
[ 1 -1  1 -1]

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.ECR.decomposition`.

Args:
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> from pprint import pprint
>>> pprint(qp.ECR.compute_decomposition((0,1)))
[Z(0),
CNOT(wires=[0, 1]),
SX(1),
RX(1.5707963267948966, wires=[0]),
RY(1.5707963267948966, wires=[0]),
RX(1.5707963267948966, wires=[0])]

## `ISWAP`

```python
class ISWAP(Operation)
```

ISWAP(wires)
The i-swap operator

.. math:: ISWAP = \begin{bmatrix}
        1 & 0 & 0 & 0 \\
        0 & 0 & i & 0\\
        0 & i & 0 & 0\\
        0 & 0 & 0 & 1
    \end{bmatrix}.

**Details:**

* Number of wires: 2
* Number of parameters: 0

Args:
    wires (Sequence[int]): the wires the operation acts on

### `compute_matrix`

```python
def compute_matrix() -> np.ndarray
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.ISWAP.matrix`

Returns:
    ndarray: matrix

**Example**

>>> print(qp.ISWAP.compute_matrix())
[[1.+0.j 0.+0.j 0.+0.j 0.+0.j]
 [0.+0.j 0.+0.j 0.+1.j 0.+0.j]
 [0.+0.j 0.+1.j 0.+0.j 0.+0.j]
 [0.+0.j 0.+0.j 0.+0.j 1.+0.j]]

### `compute_eigvals`

```python
def compute_eigvals() -> np.ndarray
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.ISWAP.eigvals`


Returns:
    array: eigenvalues

**Example**

>>> print(qp.ISWAP.compute_eigvals())
[ 0.+1.j -0.-1.j  1.+0.j  1.+0.j]

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.ISWAP.decomposition`.

Args:
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> print(qp.ISWAP.compute_decomposition((0,1)))
[S(0),
S(1),
H(0),
CNOT(wires=[0, 1]),
CNOT(wires=[1, 0]),
H(1)]

## `SISWAP`

```python
class SISWAP(Operation)
```

SISWAP(wires)
The square root of i-swap operator. Can also be accessed as ``qp.SQISW``

.. math:: SISWAP = \begin{bmatrix}
        1 & 0 & 0 & 0 \\
        0 & 1/ \sqrt{2} & i/\sqrt{2} & 0\\
        0 & i/ \sqrt{2} & 1/ \sqrt{2} & 0\\
        0 & 0 & 0 & 1
    \end{bmatrix}.

**Details:**

* Number of wires: 2
* Number of parameters: 0

Args:
    wires (Sequence[int]): the wires the operation acts on

### `compute_matrix`

```python
def compute_matrix() -> np.ndarray
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.SISWAP.matrix`


Returns:
    ndarray: matrix

**Example**

>>> from pprint import pprint
>>> pprint(qp.SISWAP.compute_matrix())
array([[1.        +0.j        , 0.        +0.j        ,
        0.        +0.j        , 0.        +0.j        ],
    [0.        +0.j        , 0.70710678+0.j        ,
        0.        +0.70710678j, 0.        +0.j        ],
    [0.        +0.j        , 0.        +0.70710678j,
        0.70710678+0.j        , 0.        +0.j        ],
    [0.        +0.j        , 0.        +0.j        ,
        0.        +0.j        , 1.        +0.j        ]])

### `compute_eigvals`

```python
def compute_eigvals() -> np.ndarray
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.SISWAP.eigvals`


Returns:
    array: eigenvalues

**Example**

>>> print(qp.SISWAP.compute_eigvals())
[0.70710678+0.70710678j 0.70710678-0.70710678j 1.        +0.j 1.        +0.j        ]

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.SISWAP.decomposition`.

Args:
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> print(qp.SISWAP.compute_decomposition((0,1)))
[SX(0),
RZ(1.5707963267948966, wires=[0]),
CNOT(wires=[0, 1]),
SX(0),
RZ(5.497787143782138, wires=[0]),
SX(0),
RZ(1.5707963267948966, wires=[0]),
SX(1),
RZ(5.497787143782138, wires=[1]),
CNOT(wires=[0, 1]),
SX(0),
SX(1)]
