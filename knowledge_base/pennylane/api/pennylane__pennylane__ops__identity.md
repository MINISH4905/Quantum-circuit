---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/identity.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/identity.py
license: Apache-2.0
---

## Module `pennylane/ops/identity.py`

This module contains the Identity operation that is common to both
cv and qubit computing paradigms in PennyLane.

## `Identity`

```python
class Identity(CVObservable, Operation)
```

The Identity operator

The expectation of this observable

.. math::
    E[I] = \text{Tr}(I \rho)

.. seealso:: The equivalent short-form alias :class:`~I`

Args:
    wires (Iterable[Any] or Any): Wire label(s) that the identity acts on.
    id (str): custom label given to an operator instance,
        can be useful for some applications where the instance has to be identified.

Corresponds to the trace of the quantum state, which in exact
simulators should always be equal to 1.

### `__repr__`

```python
def __repr__(self)
```

String representation.

### `compute_eigvals`

```python
def compute_eigvals(n_wires=1)
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.I.eigvals`

Returns:
    array: eigenvalues

**Example**

>>> print(qp.I.compute_eigvals())
[1. 1.]

### `compute_matrix`

```python
def compute_matrix(n_wires=1)
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.Identity.matrix`

Returns:
    ndarray: matrix

**Example**

>>> print(qp.Identity.compute_matrix())
[[1. 0.]
 [0. 1.]]

### `compute_diagonalizing_gates`

```python
def compute_diagonalizing_gates(wires, n_wires=1)
```

Sequence of gates that diagonalize the operator in the computational basis (static method).

Given the eigendecomposition :math:`O = U \Sigma U^{\dagger}` where
:math:`\Sigma` is a diagonal matrix containing the eigenvalues,
the sequence of diagonalizing gates implements the unitary :math:`U^{\dagger}`.

The diagonalizing gates rotate the state into the eigenbasis
of the operator.

.. seealso:: :meth:`~.Identity.diagonalizing_gates`.

Args:
    wires (Iterable[Any], Wires): wires that the operator acts on

Returns:
    list[.Operator]: list of diagonalizing gates

**Example**

>>> qp.Identity.compute_diagonalizing_gates(wires=[0])
[]

### `compute_decomposition`

```python
def compute_decomposition(wires, n_wires=1)
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.Identity.decomposition`.

Args:
    wires (Any, Wires): A single wire that the operator acts on.

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.Identity.compute_decomposition(wires=0)
[]

### `identity_op`

```python
def identity_op(*params)
```

Alias for matrix representation of the identity operator.

## `GlobalPhase`

```python
class GlobalPhase(Operation)
```

A global phase operation that multiplies all components of the state by :math:`e^{-i \phi}`.

**Details:**

* Number of wires: All (the operation acts on all wires)
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: None

Args:
    phi (TensorLike): the global phase
    wires (Iterable[Any] or Any): unused argument - the operator is applied to all wires
    id (str): custom label given to an operator instance,
        can be useful for some applications where the instance has to be identified.

**Example**

.. code-block:: python

    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit(phi=None, return_state=False):
        qp.X(0)
        if phi:
            qp.GlobalPhase(phi)
        if return_state:
            return qp.state()
        return qp.expval(qp.Z(0)), qp.expval(qp.Z(1))

The circuit yields the same expectation values with and without the global phase:

>>> circuit()
(np.float64(-1.0), np.float64(1.0))
>>> circuit(phi=0.123)
(np.float64(-1.0), np.float64(1.0))

However, the states of the two systems differ by a global phase factor:

>>> circuit(return_state=True)
array([0.+0.j, 0.+0.j, 1.+0.j, 0.+0.j])
>>> circuit(return_state=True, phi=0.123)
array([0.        +0.j        , 0.        +0.j        ,
        0.99244503-0.12269009j, 0.        +0.j        ])

### `compute_eigvals`

```python
def compute_eigvals(phi, n_wires=1)
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.GlobalPhase.eigvals`

Returns:
    array: eigenvalues

**Example**

>>> qp.GlobalPhase.compute_eigvals(np.pi/2)
array([6.123234e-17-1.j, 6.123234e-17-1.j])

### `compute_matrix`

```python
def compute_matrix(phi, n_wires=1)
```

Representation of the operator as a canonical matrix in the computational basis (static method).
The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.GlobalPhase.matrix`

Returns:
    ndarray: matrix

**Example**

>>> qp.GlobalPhase.compute_matrix(np.pi/4, n_wires=1)
array([[0.70710678-0.70710678j, 0.        +0.j        ],
       [0.        +0.j        , 0.70710678-0.70710678j]])

### `compute_diagonalizing_gates`

```python
def compute_diagonalizing_gates(phi, wires, n_wires=1)
```

Sequence of gates that diagonalize the operator in the computational basis (static method).

Given the eigendecomposition :math:`O = U \Sigma U^{\dagger}` where
:math:`\Sigma` is a diagonal matrix containing the eigenvalues,
the sequence of diagonalizing gates implements the unitary :math:`U^{\dagger}`.

The diagonalizing gates rotate the state into the eigenbasis
of the operator.

.. seealso:: :meth:`~.GlobalPhase.diagonalizing_gates`.

Args:
    wires (Iterable[Any], Wires): wires that the operator acts on

Returns:
    list[.Operator]: list of diagonalizing gates

**Example**

>>> qp.GlobalPhase.compute_diagonalizing_gates(1.2, wires=[0])
[]

### `compute_decomposition`

```python
def compute_decomposition(phi, wires: WiresLike=())
```

Representation of the operator as a product of other operators (static method).

.. note::

    The ``GlobalPhase`` operation decomposes to an empty list of operations.
    Support for global phase
    was added in v0.33 and was ignored in earlier versions of PennyLane. Setting
    global phase to decompose to nothing allows existing devices to maintain
    current support for operations which now have ``GlobalPhase`` in the
    decomposition pipeline.

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.GlobalPhase.decomposition`.

Args:
    phi (TensorLike): the global phase
    wires (Iterable[Any] or Any): unused argument - the operator is applied to all wires

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.GlobalPhase.compute_decomposition(1.23)
[]
