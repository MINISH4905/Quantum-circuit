---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/qubit/observables.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/qubit/observables.py
license: Apache-2.0
---

## Module `pennylane/ops/qubit/observables.py`

This submodule contains the discrete-variable quantum observables,
excepting the Pauli gates and Hadamard gate in ``non_parametric_ops.py``.

## `Hermitian`

```python
class Hermitian(Operator)
```

An arbitrary Hermitian observable.

For a Hermitian matrix :math:`A`, the expectation command returns the value

.. math::
    \braket{A} = \braketT{\psi}{\cdots \otimes I\otimes A\otimes I\cdots}{\psi}

where :math:`A` acts on the requested wires.

If acting on :math:`N` wires, then the matrix :math:`A` must be of size
:math:`2^N\times 2^N`.

**Details:**

* Number of wires: Any
* Number of parameters: 1
* Gradient recipe: None

Args:
    A (array or Sequence): square hermitian matrix
    wires (Sequence[int] or int): the wire(s) the operation acts on
    id (str or None): String representing the operation (optional)

.. warning::

   ``Hermitian`` is not compatible with :func:`~.probs`. When using
   :func:`~.probs` with a Hermitian observable, the output might be different than
   expected as the lexicographical ordering of eigenvalues is not guaranteed and
   the diagonalizing gates may exist in a degenerate subspace.

### `compute_matrix`

```python
def compute_matrix(A: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.Hermitian.matrix`

Args:
    A (tensor_like): hermitian matrix

Returns:
    tensor_like: canonical matrix

**Example**

>>> A = np.array([[6+0j, 1-2j],[1+2j, -1]])
>>> qp.Hermitian.compute_matrix(A)
array([[ 6.+0.j,  1.-2.j],
       [ 1.+2.j, -1.+0.j]])

### `eigendecomposition`

```python
def eigendecomposition(self) -> dict[str, TensorLike]
```

Return the eigendecomposition of the matrix specified by the Hermitian observable.

This method uses pre-stored eigenvalues for standard observables where
possible and stores the corresponding eigenvectors from the eigendecomposition.

It transforms the input operator according to the wires specified.

Returns:
    dict[str, array]: dictionary containing the eigenvalues and the eigenvectors of the Hermitian observable

### `eigvals`

```python
def eigvals(self) -> TensorLike
```

Return the eigenvalues of the specified Hermitian observable.

This method uses pre-stored eigenvalues for standard observables where
possible and stores the corresponding eigenvectors from the eigendecomposition.

Returns:
    array: array containing the eigenvalues of the Hermitian observable

### `compute_decomposition`

```python
def compute_decomposition(A, wires)
```

Decomposes a hermitian matrix as a sum of Pauli operators.

Args:
    A (array or Sequence): hermitian matrix
    wires (Iterable[Any], Wires): wires that the operator acts on
Returns:
    list[.Operator]: decomposition of the hermitian matrix

**Examples**

>>> op = qp.X(0) + qp.Y(1) + 2 * qp.X(0) @ qp.Z(3)
>>> op_matrix = qp.matrix(op)
>>> qp.Hermitian.compute_decomposition(op_matrix, wires=['a', 'b', 'aux'])
[(
      1.0 * (I('a') @ Y('b') @ I('aux'))
    + 1.0 * (X('a') @ I('b') @ I('aux'))
    + 2.0 * (X('a') @ I('b') @ Z('aux'))
)]
>>> op = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
>>> qp.Hermitian.compute_decomposition(op, wires=0)
[(
      0.7071067811865475 * X(0)
    + 0.7071067811865475 * Z(0)
)]

### `compute_diagonalizing_gates`

```python
def compute_diagonalizing_gates(eigenvectors: TensorLike, wires: WiresLike) -> list['qp.operation.Operator']
```

Sequence of gates that diagonalize the operator in the computational basis (static method).

Given the eigendecomposition :math:`O = U \Sigma U^{\dagger}` where
:math:`\Sigma` is a diagonal matrix containing the eigenvalues,
the sequence of diagonalizing gates implements the unitary :math:`U^{\dagger}`.

The diagonalizing gates rotate the state into the eigenbasis
of the operator.

.. seealso:: :meth:`~.Hermitian.diagonalizing_gates`.

Args:
    eigenvectors (array): eigenvectors of the operator, as extracted from op.eigendecomposition["eigvec"].
    wires (Iterable[Any], Wires): wires that the operator acts on
Returns:
    list[.Operator]: list of diagonalizing gates

**Example**

>>> A = np.array([[-6, 2 + 1j], [2 - 1j, 0]])
>>> _, evecs = np.linalg.eigh(A)
>>> evecs = evecs + 0 # add 0 to normalize signed zeros before printing
>>> with np.printoptions(precision=4): # easier to read the matrix
...     print(qp.Hermitian.compute_diagonalizing_gates(evecs, wires=[0]))
[QubitUnitary(array([[-0.9492-0.j    ,  0.2816+0.1408j],
       [ 0.3148-0.j    ,  0.8489+0.4245j]]), wires=[0])]

### `diagonalizing_gates`

```python
def diagonalizing_gates(self) -> list['qp.operation.Operator']
```

Return the gate set that diagonalizes a circuit according to the
specified Hermitian observable.

Returns:
    list: list containing the gates diagonalizing the Hermitian observable

## `SparseHamiltonian`

```python
class SparseHamiltonian(Operator)
```

A Hamiltonian represented directly as a sparse matrix in Compressed Sparse Row (CSR) format.

.. warning::

    ``SparseHamiltonian`` observables can only be used to return expectation values.
    Variances and samples are not supported.

**Details:**

* Number of wires: Any
* Number of parameters: 1
* Gradient recipe: None

Args:
    H (csr_matrix): a sparse matrix in SciPy Compressed Sparse Row (CSR) format with
        dimension :math:`(2^n, 2^n)`, where :math:`n` is the number of wires.
    wires (Sequence[int]): the wire(s) the operation acts on
    id (str or None): String representing the operation (optional)

**Example**

Sparse Hamiltonians can be constructed directly with a SciPy-compatible sparse matrix.

Alternatively, you can construct your Hamiltonian as usual using :class:`~.LinearCombination`, and then use
:meth:`~.LinearCombination.sparse_matrix` to construct the sparse matrix that serves as the input
to ``SparseHamiltonian``:

>>> wires = range(20)
>>> coeffs = [1 for _ in wires]
>>> observables = [qp.Z(i) for i in wires]
>>> H = qp.Hamiltonian(coeffs, observables)
>>> Hmat = H.sparse_matrix()
>>> H_sparse = qp.SparseHamiltonian(Hmat, wires)

### `__mul__`

```python
def __mul__(self, value: int | float) -> 'qp.SparseHamiltonian'
```

The scalar multiplication operation between a scalar and a SparseHamiltonian.

### `compute_matrix`

```python
def compute_matrix(H: csr_matrix) -> np.ndarray
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.SparseHamiltonian.matrix`


This method returns a dense matrix. For a sparse matrix representation, see
:meth:`~.SparseHamiltonian.compute_sparse_matrix`.

Args:
    H (scipy.sparse.csr_matrix): sparse matrix used to create the operator

Returns:
    array: dense matrix

**Example**

>>> from scipy.sparse import csr_matrix
>>> H = np.array([[6+0j, 1-2j],[1+2j, -1]])
>>> H = csr_matrix(H)
>>> res = qp.SparseHamiltonian.compute_matrix(H)
>>> res
array([[ 6.+0.j,  1.-2.j],
       [ 1.+2.j, -1.+0.j]])
>>> type(res)
<class 'numpy.ndarray'>

### `compute_sparse_matrix`

```python
def compute_sparse_matrix(H: spmatrix, format='csr') -> spmatrix
```

Representation of the operator as a sparse canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.SparseHamiltonian.sparse_matrix`

This method returns a sparse matrix. For a dense matrix representation, see
:meth:`~.SparseHamiltonian.compute_matrix`.

Args:
    H (scipy.sparse.csr_matrix): sparse matrix used to create the operator

Returns:
    scipy.sparse.csr_matrix: sparse matrix

**Example**

>>> from scipy.sparse import csr_matrix
>>> H = np.array([[6+0j, 1-2j],[1+2j, -1]])
>>> H = csr_matrix(H)
>>> res = qp.SparseHamiltonian.compute_sparse_matrix(H)
>>> res
<Compressed Sparse Row sparse matrix of dtype 'complex128'
    with 4 stored elements and shape (2, 2)>
>>> type(res)
<class 'scipy.sparse._csr.csr_matrix'>

## `Projector`

```python
class Projector(Operator)
```

Projector(state, wires, id=None)
Observable corresponding to the state projector :math:`P=\ket{\phi}\bra{\phi}`.

The expectation of this observable returns the value

.. math::
    |\langle \psi | \phi \rangle |^2

corresponding to the probability that :math:`|\psi\rangle` is projected onto :math:`|\phi\rangle` during measurement.

**Details:**

* Number of wires: Any
* Number of parameters: 1
* Gradient recipe: None

Args:
    state (tensor-like): Input state of shape ``(n,)`` for a basis-state projector, or ``(2**n,)``
        for a statevector projector.
    wires (Iterable): wires that the projector acts on.
    id (str or None): String representing the operation (optional).

**Example**

In the following example we consider projectors over two states: the :math:`|00\rangle` and the
:math:`|++\rangle`. Since the first one is in the computational basis, we create its projector
directly from its basis state representation, which is, ``zero_state=[0, 0]``. For the latter,
we need to use its state vector form ``plusplus_state=np.array([1, 1, 1, 1])/2``.

.. code-block::

    >>> dev = qp.device("default.qubit", wires=2)
    >>> @qp.qnode(dev)
    ... def circuit(state):
    ...     return qp.expval(qp.Projector(state, wires=[0, 1]))
    >>> zero_state = [0, 0]
    >>> circuit(zero_state)
    np.float64(1.0)
    >>> plusplus_state = np.array([1, 1, 1, 1]) / 2
    >>> circuit(plusplus_state)
    np.float64(0.25000000000000067)

### `__new__`

```python
def __new__(cls, state: TensorLike, wires: WiresLike, **_)
```

Changes parents based on the state representation.

Though all the types will be named "Projector", their *identity* and location in memory
will be different based on whether the input state is a basis state or a state vector.
We cache the different types in private class variables so that:

>>> state = [0, 1]
>>> wires = 0
>>> basis_state = [0, 1]
>>> state_vector = [0, 0, 1, 0]
>>> Projector(state, wires).__class__ is Projector(state, wires).__class__
True
>>> type(Projector(state, wires)) == type(Projector(state, wires))
True
>>> isinstance(Projector(state, wires), type(Projector(state, wires)))
True

### `pow`

```python
def pow(self, z: int | float) -> list['qp.operation.Operator']
```

Raise this projector to the power ``z``.

## `BasisStateProjector`

```python
class BasisStateProjector(Projector, Operation)
```

Observable corresponding to the state projector :math:`P=\ket{\phi}\bra{\phi}`, where
:math:`\phi` denotes a basis state.

### `label`

```python
def label(self, decimals: int | None=None, base_label: str | None=None, cache: dict | None=None) -> str
```

A customizable string representation of the operator.

Args:
    decimals=None (int): If ``None``, no parameters are included. Else,
        specifies how to round the parameters.
    base_label=None (str): overwrite the non-parameter component of the label.
    cache=None (dict): dictionary that caries information between label calls
        in the same drawing.

Returns:
    str: label to use in drawings.

**Example:**

>>> BasisStateProjector([0, 1, 0], wires=(0, 1, 2)).label()
'|010⟩⟨010|'

### `compute_matrix`

```python
def compute_matrix(basis_state: TensorLike) -> np.ndarray
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.BasisStateProjector.matrix`

Args:
    basis_state (Iterable): basis state to project on

Returns:
    ndarray: matrix

**Example**

>>> BasisStateProjector.compute_matrix([0, 1])
array([[0., 0., 0., 0.],
       [0., 1., 0., 0.],
       [0., 0., 0., 0.],
       [0., 0., 0., 0.]])

### `compute_eigvals`

```python
def compute_eigvals(basis_state: TensorLike) -> np.ndarray
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.BasisStateProjector.eigvals`

Args:
    basis_state (Iterable): basis state to project on

Returns:
    array: eigenvalues

**Example**

>>> BasisStateProjector.compute_eigvals([0, 1])
array([0., 1., 0., 0.])

### `compute_diagonalizing_gates`

```python
def compute_diagonalizing_gates(basis_state: TensorLike, wires: WiresLike) -> list['qp.operation.Operator']
```

Sequence of gates that diagonalize the operator in the computational basis (static method).

Given the eigendecomposition :math:`O = U \Sigma U^{\dagger}` where
:math:`\Sigma` is a diagonal matrix containing the eigenvalues,
the sequence of diagonalizing gates implements the unitary :math:`U^{\dagger}`.

The diagonalizing gates rotate the state into the eigenbasis
of the operator.

.. seealso:: :meth:`~.BasisStateProjector.diagonalizing_gates`.

Args:
    basis_state (Iterable): basis state that the operator projects on
    wires (Iterable[Any], Wires): wires that the operator acts on
Returns:
    list[.Operator]: list of diagonalizing gates

**Example**

>>> BasisStateProjector.compute_diagonalizing_gates([0, 1, 0, 0], wires=[0, 1])
[]

### `compute_sparse_matrix`

```python
def compute_sparse_matrix(basis_state: TensorLike, format='csr') -> spmatrix
```

Computes the sparse CSR matrix representation of the projector onto the basis state.

Args:
    basis_state (Iterable): The basis state as an iterable of integers (0 or 1).

Returns:
    scipy.sparse.csr_matrix: The sparse CSR matrix representation of the projector.

## `StateVectorProjector`

```python
class StateVectorProjector(Projector)
```

Observable corresponding to the state projector :math:`P=\ket{\phi}\bra{\phi}`, where
:math:`\phi` denotes a state.

### `label`

```python
def label(self, decimals: int | None=None, base_label: str | None=None, cache: dict | None=None) -> str
```

A customizable string representation of the operator.

Args:
    decimals=None (int): If ``None``, no parameters are included. Else,
        specifies how to round the parameters.
    base_label=None (str): overwrite the non-parameter component of the label.
    cache=None (dict): dictionary that caries information between label calls
        in the same drawing.

Returns:
    str: label to use in drawings.

**Example:**

>>> state_vector = np.array([0, 1, 1, 0])/np.sqrt(2)
>>> qp.Projector(state_vector, wires=(0, 1)).label()
'P'
>>> qp.Projector(state_vector, wires=(0, 1)).label(base_label="hi!")
'hi!'
>>> dev = qp.device("default.qubit", wires=1)
>>> @qp.qnode(dev)
... def circuit(state):
...     return qp.expval(qp.Projector(state, [0]))
>>> print(qp.draw(circuit)([1, 0]))
0: ───┤  <|0⟩⟨0|>
>>> print(qp.draw(circuit)(np.array([1, 1]) / np.sqrt(2)))
0: ───┤  <P(M0)>
M0 =
[0.70710678 0.70710678]

### `compute_matrix`

```python
def compute_matrix(state_vector: TensorLike) -> np.ndarray
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.Projector.matrix`

Args:
    state_vector (Iterable): state vector to project on

Returns:
    ndarray: matrix

**Example**

The projector of the state :math:`\frac{1}{\sqrt{2}}(\ket{01}+\ket{10})`

>>> StateVectorProjector.compute_matrix([0, 1/np.sqrt(2), 1/np.sqrt(2), 0])
array([[0. , 0. , 0. , 0. ],
       [0. , 0.5, 0.5, 0. ],
       [0. , 0.5, 0.5, 0. ],
       [0. , 0. , 0. , 0. ]])

### `compute_eigvals`

```python
def compute_eigvals(state_vector: TensorLike) -> np.ndarray
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.StateVectorProjector.eigvals`

Args:
    state_vector (Iterable): state vector to project on

Returns:
    array: eigenvalues

**Example**

>>> StateVectorProjector.compute_eigvals(np.array([0, 0, 1, 0]))
array([1., 0., 0., 0.])

### `compute_diagonalizing_gates`

```python
def compute_diagonalizing_gates(state_vector: TensorLike, wires: WiresLike) -> list['qp.operation.Operator']
```

Sequence of gates that diagonalize the operator in the computational basis (static method).

Given the eigendecomposition :math:`O = U \Sigma U^{\dagger}` where
:math:`\Sigma` is a diagonal matrix containing the eigenvalues,
the sequence of diagonalizing gates implements the unitary :math:`U^{\dagger}`.

The diagonalizing gates rotate the state into the eigenbasis
of the operator.

.. seealso:: :meth:`~.StateVectorProjector.diagonalizing_gates`.

Args:
    state_vector (Iterable): state vector that the operator projects on.
    wires (Iterable[Any], Wires): wires that the operator acts on.
Returns:
    list[.Operator]: list of diagonalizing gates.

**Example**

>>> state_vector = np.array([1., 1j])/np.sqrt(2)
>>> StateVectorProjector.compute_diagonalizing_gates(state_vector, wires=[0])
[QubitUnitary(array([[ 0.70710678+0.j        ,  0.        -0.70710678j],
                     [ 0.        +0.70710678j, -0.70710678+0.j        ]]), wires=[0])]
