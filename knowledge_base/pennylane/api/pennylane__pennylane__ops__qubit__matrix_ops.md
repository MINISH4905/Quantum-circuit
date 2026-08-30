---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/qubit/matrix_ops.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/qubit/matrix_ops.py
license: Apache-2.0
---

## Module `pennylane/ops/qubit/matrix_ops.py`

This submodule contains the discrete-variable quantum operations that
accept a hermitian or an unitary matrix as a parameter.

## `QubitUnitary`

```python
class QubitUnitary(Operation)
```

QubitUnitary(U, wires)
Apply an arbitrary unitary matrix with a dimension that is a power of two.

.. warning::

    The sparse matrix representation of QubitUnitary is still under development. Currently,
    we only support a limited set of interfaces that preserve the sparsity of the matrix,
    including :func:`~.adjoint`, :func:`~.pow`, and :meth:`~.QubitUnitary.compute_sparse_matrix`.
    Differentiability is not supported for sparse matrices.

**Details:**

* Number of wires: Any (the operation can act on any number of wires)
* Number of parameters: 1
* Number of dimensions per parameter: (2,)
* Gradient recipe: None

Args:
    U (array[complex] or csr_matrix): square unitary matrix
    wires (Sequence[int] or int): the wire(s) the operation acts on
    id (str): custom label given to an operator instance,
        can be useful for some applications where the instance has to be identified
    unitary_check (bool): check for unitarity of the given matrix

Raises:
    ValueError: if the number of wires doesn't fit the dimensions of the matrix

**Example**

>>> dev = qp.device('default.qubit', wires=1)
>>> U = 1 / np.sqrt(2) * np.array([[1, 1], [1, -1]])
>>> @qp.qnode(dev)
... def example_circuit():
...     qp.QubitUnitary(U, wires=0)
...     return qp.expval(qp.Z(0))
>>> print(example_circuit())
0.0

### `compute_matrix`

```python
def compute_matrix(U: TensorLike)
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.QubitUnitary.matrix`

Args:
    U (tensor_like): unitary matrix

Returns:
    tensor_like: canonical matrix

**Example**

>>> U = np.array([[0.98877108+0.j, 0.-0.14943813j], [0.-0.14943813j, 0.98877108+0.j]])
>>> qp.QubitUnitary.compute_matrix(U)
 array([[0.988...+0.j        , 0.        -0.149...j],
        [0.        -0.149...j, 0.988...+0.j        ]])

### `compute_sparse_matrix`

```python
def compute_sparse_matrix(U: TensorLike, format='csr')
```

Representation of the operator as a sparse matrix.

Args:
    U (tensor_like): unitary matrix

Returns:
    csr_matrix: sparse matrix representation

**Example**

>>> U = np.array([
...     [1, 0, 0, 0],
...     [0, 1, 0, 0],
...     [0, 0, 0, 1],
...     [0, 0, 1, 0]
... ])
>>> U = sp.sparse.csr_matrix(U)
>>> qp.QubitUnitary.compute_sparse_matrix(U)
<Compressed Sparse Row sparse matrix of dtype 'int64'
    with 4 stored elements and shape (4, 4)>

### `compute_decomposition`

```python
def compute_decomposition(U: TensorLike, wires: WiresLike)
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

See :func:`~.ops.one_qubit_decomposition`, :func:`~.ops.two_qubit_decomposition`
and :func:`~.ops.multi_qubit_decomposition` for more information on how the decompositions are computed.

.. seealso:: :meth:`~.QubitUnitary.decomposition`.

Args:
    U (array[complex]): square unitary matrix
    wires (Iterable[Any] or Wires): the wire(s) the operation acts on

Returns:
    list[Operator]: decomposition of the operator

**Example:**

>>> U = 1 / np.sqrt(2) * np.array([[1, 1], [1, -1]])
>>> decomp = qp.QubitUnitary.compute_decomposition(U, 0)
>>> from pprint import pprint
>>> pprint(decomp)
[RZ(np.float64(3.141...), wires=[0]),
RY(np.float64(1.570...), wires=[0]),
RZ(np.float64(0.0), wires=[0]),
GlobalPhase(np.float64(-1.570...), wires=[])]

## `DiagonalQubitUnitary`

```python
class DiagonalQubitUnitary(Operation)
```

DiagonalQubitUnitary(D, wires)
Apply an arbitrary diagonal unitary matrix with a dimension that is a power of two.

**Details:**

* Number of wires: Any (the operation can act on any number of wires)
* Number of parameters: 1
* Number of dimensions per parameter: (1,)
* Gradient recipe: None

Args:
    D (array[complex]): diagonal of unitary matrix
    wires (Sequence[int] or int): the wire(s) the operation acts on

### `compute_matrix`

```python
def compute_matrix(D: TensorLike) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.DiagonalQubitUnitary.matrix`

Args:
    D (tensor_like): diagonal of the matrix

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.DiagonalQubitUnitary.compute_matrix(torch.tensor([1, -1]))
tensor([[ 1,  0],
        [ 0, -1]])

### `compute_eigvals`

```python
def compute_eigvals(D: TensorLike) -> TensorLike
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.DiagonalQubitUnitary.eigvals`

Args:
    D (tensor_like): diagonal of the matrix

Returns:
    tensor_like: eigenvalues

**Example**

>>> qp.DiagonalQubitUnitary.compute_eigvals(torch.tensor([1, -1]))
tensor([ 1, -1])

### `compute_decomposition`

```python
def compute_decomposition(D: TensorLike, wires: WiresLike) -> list['qp.operation.Operator']
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

``DiagonalQubitUnitary`` decomposes into :class:`~.DiagonalQubitUnitary`, :class:`~.SelectPauliRot`,
:class:`~.RZ`, and/or :class:`~.GlobalPhase` depending on the number of wires.

.. note::

    The parameters of the decomposed operations are cast to the ``complex128`` dtype
    as real dtypes can lead to ``NaN`` values in the decomposition.

.. seealso:: :meth:`~.DiagonalQubitUnitary.decomposition`.

Args:
    D (tensor_like): diagonal of the matrix
    wires (Iterable[Any] or Wires): the wire(s) the operation acts on

Returns:
    list[Operator]: decomposition into lower level operations

Implements Theorem 7 of `Shende et al. <https://arxiv.org/abs/quant-ph/0406176>`__.
Decomposing a ``DiagonalQubitUnitary`` on :math:`n` wires (:math:`n>1`) yields a
uniformly-controlled :math:`R_Z` gate, or :class:`~.SelectPauliRot` gate, as well as a
``DiagonalQubitUnitary`` on :math:`n-1` wires. For :math:`n=1` wires, the decomposition
yields a :class:`~.RZ` gate and a :class:`~.GlobalPhase`.
Resolving this recursion relationship, one would obtain :math:`n-1` ``SelectPauliRot``
gates with :math:`n, n-1, \dots, 1` controls each, a single ``RZ`` gate, and
a ``GlobalPhase``.

**Example:**

>>> diag = np.exp(1j * np.array([0.4, 2.1, 0.5, 1.8]))
>>> qp.DiagonalQubitUnitary.compute_decomposition(diag, wires=[0, 1])
[DiagonalQubitUnitary(array([0.31532236+0.94898462j, 0.40848744+0.91276394j]), wires=[0]),
SelectPauliRot(array([1.7, 1.3]), wires=[0, 1])]

.. details::
    :title: Finding the parameters

    Theorem 7 referenced above only tells us the structure of the circuit, but not the
    parameters for the ``SelectPauliRot`` and ``DiagonalQubitUnitary`` in the decomposition.
    In the following, we will only write out the diagonals of all gates.
    Consider a ``DiagonalQubitUnitary`` on :math:`n` qubits that we want to decompose:

    .. math::

        D(\theta) = (\exp(i\theta_0), \exp(i\theta_1), \dots,
        \exp(i\theta_{N-2}), \exp(i\theta_{N-1})).

    Here, :math:`N=2^n` is the Hilbert space dimension for :math:`n` qubits, which is
    the same as the number of parameters in :math:`D`.

    A ``SelectPauliRot`` gate using ``RZ`` rotations, or multiplexed ``RZ`` rotation, using
    the first :math:`n-1` qubits as controls and the last qubit as target, takes the form

    .. math::

        UCR_Z(\phi) = (\exp(-\frac{i}{2}\phi_0), \exp(\frac{i}{2}\phi_0), \dots,
        \exp(-\frac{i}{2}\phi_{N/2-1}), \exp(\frac{i}{2}\phi_{N/2-1})),

    i.e., it moves the phase of neighbouring pairs of computational basis states by
    the same amount, but in opposite direction. There are :math:`N/2` parameters
    in this gate.
    Similarly, a ``DiagonalQubitUnitary`` acting on the first :math:`n-1` qubits only (the
    ones that were controls for ``SelectPauliRot``) takes the form

    .. math::

        D'(\theta') = (\exp(i\theta'_0), \exp(i\theta'_0), \dots,
        \exp(i\theta'_{N/2-1}), \exp(i\theta'_{N/2-1})).

    That is, :math:`D'` moves the phase of neighbouring pairs of basis states by the same
    amount and in the same direction. It, too, has :math:`N/2` parameters.
    Now, we see that we can compute the rotation angles, or phases, :math:`\phi` and
    :math:`\theta'` quite easily from the original :math:`\theta`:

    .. math::

        (\exp(i\theta_{2i}), \exp(i\theta_{2i+1})) &=
        (\exp(-\frac{i}{2}\phi_i)\exp(i\theta'_i), \exp(\frac{i}{2}\phi_i)\exp(i\theta'_i))\\
        \Rightarrow \qquad \theta'_i &=\frac{1}{2}(\theta_{2i}+\theta_{2i+1})\\
        \phi_i &=\theta_{2i+1}-\theta_{2i}.

    So the phases for the new gates arise simply as difference and average of the
    odd-indexed and even-indexed phases.

## `BlockEncode`

```python
class BlockEncode(Operation)
```

BlockEncode(A, wires)
Construct a unitary :math:`U(A)` such that an arbitrary matrix :math:`A`
is encoded in the top-left block.

.. math::

    \begin{align}
         U(A) &=
         \begin{bmatrix}
            A & \sqrt{I-AA^\dagger} \\
            \sqrt{I-A^\dagger A} & -A^\dagger
        \end{bmatrix}.
    \end{align}

**Details:**

* Number of wires: Any (the operation can act on any number of wires)
* Number of parameters: 1
* Number of dimensions per parameter: (2,)
* Gradient recipe: None

Args:
    A (tensor_like): a general :math:`(n \times m)` matrix to be encoded
    wires (Iterable[int, str], Wires): the wires the operation acts on
    id (str or None): String representing the operation (optional)

Raises:
    ValueError: if the number of wires doesn't fit the dimensions of the matrix

**Example**

We can define a matrix and a block-encoding circuit as follows:

>>> A = [[0.1,0.2],[0.3,0.4]]
>>> dev = qp.device('default.qubit', wires=2)
>>> @qp.qnode(dev)
... def example_circuit():
...     qp.BlockEncode(A, wires=range(2))
...     return qp.state()

We can see that :math:`A` has been block encoded in the matrix of the circuit:

>>> print(qp.matrix(example_circuit)())
[[ 0.1         0.2         0.97283788 -0.05988708]
 [ 0.3         0.4        -0.05988708  0.86395228]
 [ 0.94561648 -0.07621992 -0.1        -0.3       ]
 [-0.07621992  0.89117368 -0.2        -0.4       ]]

We can also block-encode a non-square matrix and check the resulting unitary matrix:

>>> A = [[0.2, 0, 0.2],[-0.2, 0.2, 0]]
>>> op = qp.BlockEncode(A, wires=range(3))
>>> print(np.round(qp.matrix(op), 2))
[[ 0.2   0.    0.2   0.96  0.02  0.    0.    0.  ]
 [-0.2   0.2   0.    0.02  0.96  0.    0.    0.  ]
 [ 0.96  0.02 -0.02 -0.2   0.2   0.    0.    0.  ]
 [ 0.02  0.98  0.   -0.   -0.2   0.    0.    0.  ]
 [-0.02  0.    0.98 -0.2  -0.    0.    0.    0.  ]
 [ 0.    0.    0.    0.    0.    1.    0.    0.  ]
 [ 0.    0.    0.    0.    0.    0.    1.    0.  ]
 [ 0.    0.    0.    0.    0.    0.    0.    1.  ]]

.. note::
    If the operator norm of :math:`A`  is greater than 1, we normalize it to ensure
    :math:`U(A)` is unitary. The normalization constant can be
    accessed through :code:`op.hyperparameters["norm"]`.

    Specifically, the norm is computed as the maximum of
    :math:`\| AA^\dagger \|` and
    :math:`\| A^\dagger A \|`.

### `has_sparse_matrix`

```python
def has_sparse_matrix(self) -> bool
```

bool: Whether the operator has a sparse matrix representation.

### `has_matrix`

```python
def has_matrix(self) -> bool
```

bool: Whether the operator has a sparse matrix representation.

### `compute_matrix`

```python
def compute_matrix(*params, **hyperparams)
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.BlockEncode.matrix`

Args:
    *params (list): trainable parameters of the operator, as stored in the ``parameters`` attribute
    **hyperparams (dict): non-trainable hyperparameters of the operator, as stored in the ``hyperparameters`` attribute


Returns:
    tensor_like: canonical matrix

**Example**

>>> A = np.array([[0.1,0.2],[0.3,0.4]])
>>> A
array([[0.1, 0.2],
    [0.3, 0.4]])
>>> qp.BlockEncode.compute_matrix(A, subspace=[2,2,4])
array([[ 0.1       ,  0.2       ,  0.97283788, -0.05988708],
       [ 0.3       ,  0.4       , -0.05988708,  0.86395228],
       [ 0.94561648, -0.07621992, -0.1       , -0.3       ],
       [-0.07621992,  0.89117368, -0.2       , -0.4       ]])
