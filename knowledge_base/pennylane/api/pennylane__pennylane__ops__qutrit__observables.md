---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/qutrit/observables.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/qutrit/observables.py
license: Apache-2.0
---

## Module `pennylane/ops/qutrit/observables.py`

This submodule contains the qutrit quantum observables.

## `THermitian`

```python
class THermitian(Hermitian)
```

An arbitrary Hermitian observable for qutrits.

For a Hermitian matrix :math:`A`, the expectation command returns the value

.. math::
    \braket{A} = \braketT{\psi}{\cdots \otimes I\otimes A\otimes I\cdots}{\psi}

where :math:`A` acts on the requested wires.

If acting on :math:`N` wires, then the matrix :math:`A` must be of size
:math:`3^N\times 3^N`.

**Details:**

* Number of wires: Any
* Number of parameters: 1
* Gradient recipe: None

Args:
    A (array): square Hermitian matrix
    wires (Sequence[int] or int): the wire(s) the operation acts on
    id (str or None): String representing the operation (optional)

.. note::
    :class:`Hermitian` cannot be used with qutrit devices due to its use of
    :class:`QubitUnitary` in :meth:`~.Hermitian.compute_diagonalizing_gates`.

### `compute_matrix`

```python
def compute_matrix(A)
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.THermitian.matrix`

Args:
    A (tensor_like): Hermitian matrix

Returns:
    tensor_like: canonical matrix

**Example**

>>> A = np.array([[6+0j, 1-2j, 0],[1+2j, -1, 0], [0, 0, 1]])
>>> qp.THermitian.compute_matrix(A)
array([[ 6.+0.j,  1.-2.j,  0.+0.j],
       [ 1.+2.j, -1.+0.j,  0.+0.j],
       [ 0.+0.j,  0.+0.j,  1.+0.j]])

### `eigendecomposition`

```python
def eigendecomposition(self)
```

Return the eigendecomposition of the matrix specified by the Hermitian observable.

This method uses pre-stored eigenvalues for standard observables where
possible and stores the corresponding eigenvectors from the eigendecomposition.

It transforms the input operator according to the wires specified.

Returns:
    dict[str, array]: dictionary containing the eigenvalues and the eigenvectors of the
        Hermitian observable

### `compute_diagonalizing_gates`

```python
def compute_diagonalizing_gates(eigenvectors, wires)
```

Sequence of gates that diagonalize the operator in the computational basis (static method).

Given the eigendecomposition :math:`O = U \Sigma U^{\dagger}` where
:math:`\Sigma` is a diagonal matrix containing the eigenvalues,
the sequence of diagonalizing gates implements the unitary :math:`U^{\dagger}`.

The diagonalizing gates rotate the state into the eigenbasis
of the operator.

.. seealso:: :meth:`~.THermitian.diagonalizing_gates`.

Args:
    eigenvectors (array): eigenvectors of the operator, as extracted from op.eigendecomposition["eigvec"]
    wires (Iterable[Any], Wires): wires that the operator acts on
Returns:
    list[.Operator]: list of diagonalizing gates

**Example**

>>> A = np.array([[-6, 2 + 1j, 0], [2 - 1j, 0, 0], [0, 0, 1]])
>>> _, evecs = np.linalg.eigh(A)
>>> evecs = evecs + 0 # add 0 to normalize signed zeros before printing
>>> from pprint import pprint
>>> with np.printoptions(precision=4): # easier to read the matrix
...     pprint(qp.THermitian.compute_diagonalizing_gates(evecs, wires=[0]))
[QutritUnitary(array([[-0.9492-0.j    ,  0.2816+0.1408j,  0.    -0.j    ],
       [ 0.3148-0.j    ,  0.8489+0.4245j,  0.    -0.j    ],
       [ 0.    -0.j    ,  0.    -0.j    ,  1.    -0.j    ]]), wires=[0])]

## `GellMann`

```python
class GellMann(Operator)
```

The Gell-Mann observables for qutrits

The Gell-Mann matrices are a set of 8 linearly independent :math:`3 \times 3` traceless, Hermitian matrices which
naturally generalize the Pauli matrices from :math:`SU(2)` to :math:`SU(3)`.

.. math::
    \displaystyle \begin{align} \lambda_{1} &= \left(\begin{array}{ccc} 0 & 1 & 0 \\ 1 & 0 & 0\\ 0 & 0 & 0\end{array}\right) \;\;\;\;\;\;\;\;\;\;
    \lambda_{2} = \left(\begin{array}{ccc} 0 & -i & 0 \\ i & 0 & 0\\ 0 & 0 & 0\end{array}\right)\;\;\;\;\;\;\;\;\;\;
    \lambda_{3} = \left(\begin{array}{ccc} 1 & 0 & 0 \\ 0 & -1 & 0\\ 0 & 0 & 0\end{array}\right) \\
    \lambda_{4} &= \left(\begin{array}{ccc} 0 & 0 & 1 \\ 0 & 0 & 0\\ 1 & 0 & 0\end{array}\right)\;\;\;\;\;\;\;\;\;\;
    \lambda_{5} = \left(\begin{array}{ccc} 0 & 0 & -i \\ 0 & 0 & 0\\ i & 0 & 0\end{array}\right) \\
    \lambda_{6} &= \left(\begin{array}{ccc} 0 & 0 & 0 \\ 0 & 0 & 1\\ 0 & 1 & 0\end{array}\right)\;\;\;\;\;\;\;\;\;\;
    \lambda_{7} = \left(\begin{array}{ccc} 0 & 0 & 0 \\ 0 & 0 & -i\\ 0 & i & 0\end{array}\right)\;\;\;\;\;\;\;\;\;\;
    \lambda_{8} = \frac{1}{\sqrt{3}}\left(\begin{array}{ccc} 1 & 0 & 0 \\ 0 & 1 & 0\\ 0 & 0 & -2\end{array}\right)\\ \end{align}

**Details:**

* Number of wires: 1
* Number of parameters: 0
* Gradient recipe: None

Args:
    wires (Sequence[int] or int): the wire(s) the observable acts on
    index (int): The index of the Gell-Mann matrix to be used. Must be between 1
        and 8 inclusive
    id (str or None): String representing the operation (optional)

**Example:**

>>> dev = qp.device("default.qutrit", wires=2)
>>> @qp.qnode(dev)
... def test_qnode():
...     qp.TShift(wires=0)
...     qp.TClock(wires=0)
...     qp.TShift(wires=1)
...     qp.TAdd(wires=[0, 1])
...     return qp.expval(qp.GellMann(wires=0, index=1))
>>> print(test_qnode())
0.0
>>> print(qp.draw(test_qnode)())
0: ──TShift──TClock─╭TAdd─┤  <GellMann(1)>
1: ──TShift─────────╰TAdd─┤

### `queue`

```python
def queue(self, context=qp.QueuingManager)
```

Append the operator to the Operator queue.

### `compute_matrix`

```python
def compute_matrix(index)
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.GellMann.matrix`

Args:
    index (int): The index of the Gell-Mann matrix to be used. Must be between 1
    and 8 inclusive

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.GellMann.compute_matrix(8)
array([[ 0.57735027+0.j,  0.        +0.j,  0.        +0.j],
       [ 0.        +0.j,  0.57735027+0.j,  0.        +0.j],
       [ 0.        +0.j,  0.        +0.j, -1.15470054+0.j]])

### `compute_eigvals`

```python
def compute_eigvals(index)
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.GellMann.eigvals`

Args:
    index (int): The index of the Gell-Mann matrix to be used. Must be between 1
    and 8 inclusive

Returns:
    array: eigenvalues

**Example**

>>> qp.GellMann.compute_eigvals(1)
array([ 1, -1,  0])

### `compute_diagonalizing_gates`

```python
def compute_diagonalizing_gates(wires, index)
```

Sequence of gates that diagonalize the operator in the computational basis (static method).

Given the eigendecomposition :math:`O = U \Sigma U^{\dagger}` where
:math:`\Sigma` is a diagonal matrix containing the eigenvalues,
the sequence of diagonalizing gates implements the unitary :math:`U^{\dagger}`.

The diagonalizing gates rotate the state into the eigenbasis
of the operator.

.. seealso:: :meth:`~.GellMann.diagonalizing_gates`.

Args:
    index (int): The index of the Gell-Mann matrix to be used. Must be between 1 and 8 inclusive
    wires (Iterable[Any], Wires): wires that the operator acts on
Returns:
    list[.Operator]: list of diagonalizing gates

**Example**

>>> qp.GellMann.compute_diagonalizing_gates(wires=0, index=4)
[QutritUnitary(array([[ 0.70710678-0.j,  0.        -0.j,  0.70710678-0.j],
       [ 0.70710678-0.j,  0.        -0.j, -0.70710678-0.j],
       [ 0.        -0.j,  1.        -0.j,  0.        -0.j]]), wires=[0])]
