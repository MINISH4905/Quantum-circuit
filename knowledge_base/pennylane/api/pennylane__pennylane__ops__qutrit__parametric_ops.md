---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/qutrit/parametric_ops.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/qutrit/parametric_ops.py
license: Apache-2.0
---

## Module `pennylane/ops/qutrit/parametric_ops.py`

This submodule contains the discrete-variable quantum operations that are the
core parametrized gates for qutrits.

## `validate_subspace`

```python
def validate_subspace(subspace)
```

Validate the subspace for qutrit operations.

This method determines whether a given subspace for qutrit operations
is defined correctly or not. If not, a ``ValueError`` is thrown.

Args:
    subspace (tuple[int]): Subspace to check for correctness

## `TRX`

```python
class TRX(Operation)
```

The single qutrit X rotation

Performs the RX operation on the specified 2D subspace. The subspace is
given as a keyword argument and determines which two of three single-qutrit
basis states the operation applies to.

The construction of this operator is based on section 3 of
`Di et al. (2012) <https://arxiv.org/abs/1105.5485>`_.

.. math:: TRX^{jk}(\phi) = \exp(-i\phi\sigma_x^{jk}/2),

where :math:`\sigma_x^{jk} = |j\rangle\langle k| + |k\rangle\langle j|;`
:math:`j, k \in \{0, 1, 2\}, j < k`.

.. seealso:: :class:`~.RX`

**Details:**

* Number of wires: 1
* Number of parameters: 1
* Number of dimensions per parameter: (0,)

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int] or int): the wire the operation acts on
    subspace (Sequence[int]): the 2D subspace on which to apply operation
    id (str or None): String representing the operation (optional)

**Example**

The specified subspace will determine which basis states the operation actually
applies to:

>>> qp.TRX(0.5, wires=0, subspace=(0, 1)).matrix()
array([[0.96891242+0.j        , 0.        -0.24740396j, 0.        +0.j        ],
       [0.        -0.24740396j, 0.96891242+0.j        , 0.        +0.j        ],
       [0.        +0.j        , 0.        +0.j        , 1.        +0.j        ]])

>>> qp.TRX(0.5, wires=0, subspace=(0, 2)).matrix()
array([[0.96891242+0.j        , 0.        +0.j        , 0.        -0.24740396j],
       [0.        +0.j        , 1.        +0.j        , 0.        +0.j        ],
       [0.        -0.24740396j, 0.        +0.j        , 0.96891242+0.j        ]])

>>> qp.TRX(0.5, wires=0, subspace=(1, 2)).matrix()
array([[1.        +0.j        , 0.        +0.j        , 0.        +0.j        ],
       [0.        +0.j        , 0.96891242+0.j        , 0.        -0.24740396j],
       [0.        +0.j        , 0.        -0.24740396j, 0.96891242+0.j        ]])

### `subspace`

```python
def subspace(self)
```

The single-qutrit basis states which the operator acts on

This subspace determines which two single-qutrit basis states the operator acts on.
The remaining basis state is not affected by the operator.

Returns:
    tuple[int]: subspace on which operator acts

### `compute_matrix`

```python
def compute_matrix(theta, subspace=(0, 1))
```

Representation of the operator as a canonical matrix in the computational basis.

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.TRX.matrix`

Args:
    theta (tensor_like or float): rotation angle
    subspace (Sequence[int]): the 2D subspace on which to apply the operation

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.TRX.compute_matrix(torch.tensor(0.5), subspace=(0, 2))
tensor([[0.9689+0.0000j, 0.0000+0.0000j, 0.0000-0.2474j],
        [0.0000+0.0000j, 1.0000+0.0000j, 0.0000+0.0000j],
        [0.0000-0.2474j, 0.0000+0.0000j, 0.9689+0.0000j]])

## `TRY`

```python
class TRY(Operation)
```

The single qutrit Y rotation

Performs the RY operation on the specified 2D subspace. The subspace is
given as a keyword argument and determines which two of three single-qutrit
basis states the operation applies to.

The construction of this operator is based on section 3 of
`Di et al. (2012) <https://arxiv.org/abs/1105.5485>`_.

.. math:: TRY^{jk}(\phi) = \exp(-i\phi\sigma_y^{jk}/2),

where :math:`\sigma_y^{jk} = -i |j\rangle\langle k| + i |k\rangle\langle j|;`
:math:`j, k \in \{0, 1, 2\}, j < k`.

**Details:**

* Number of wires: 1
* Number of parameters: 1
* Number of dimensions per parameter: (0,)

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int] or int): the wire the operation acts on
    subspace (Sequence[int]): the 2D subspace on which to apply operation
    id (str or None): String representing the operation (optional)

**Example**

The specified subspace will determine which basis states the operation actually
applies to:

>>> qp.TRY(0.5, wires=0, subspace=(0, 1)).matrix()
array([[ 0.96891242+0.j, -0.24740396-0.j, -0.        -0.j],
       [ 0.24740396+0.j,  0.96891242+0.j, -0.        -0.j],
       [ 0.        +0.j,  0.        +0.j,  1.        +0.j]])

>>> qp.TRY(0.5, wires=0, subspace=(0, 2)).matrix()
array([[ 0.96891242+0.j, -0.        -0.j, -0.24740396-0.j],
       [ 0.        +0.j,  1.        +0.j, -0.        -0.j],
       [ 0.24740396+0.j,  0.        +0.j,  0.96891242+0.j]])

>>> qp.TRY(0.5, wires=0, subspace=(1, 2)).matrix()
array([[ 1.        +0.j, -0.        -0.j, -0.        -0.j],
       [ 0.        +0.j,  0.96891242+0.j, -0.24740396-0.j],
       [ 0.        +0.j,  0.24740396+0.j,  0.96891242+0.j]])

### `subspace`

```python
def subspace(self)
```

The single-qutrit basis states which the operator acts on

This subspace determines which two single-qutrit basis states the operator acts on.
The remaining basis state is not affected by the operator.

Returns:
    tuple[int]: subspace on which operator acts

### `compute_matrix`

```python
def compute_matrix(theta, subspace=(0, 1))
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.TRY.matrix`

Args:
    theta (tensor_like or float): rotation angle
    subspace (Sequence[int]): the 2D subspace on which to apply operation

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.TRY.compute_matrix(torch.tensor(0.5), subspace=(0, 2))
tensor([[ 0.9689+0.j, -0.0000-0.j, -0.2474-0.j],
        [ 0.0000+0.j,  1.0000+0.j, -0.0000-0.j],
        [ 0.2474+0.j,  0.0000+0.j,  0.9689+0.j]])

## `TRZ`

```python
class TRZ(Operation)
```

The single qutrit Z rotation

Performs the RZ operation on the specified 2D subspace. The subspace is
given as a keyword argument and determines which two of three single-qutrit
basis states the operation applies to.

The construction of this operator is based on section 3 of
`Di et al. (2012) <https://arxiv.org/abs/1105.5485>`_.

.. math:: TRZ^{jk}(\phi) = \exp(-i\phi\sigma_z^{jk}/2),

where :math:`\sigma_z^{jk} = |j\rangle\langle j| - |k\rangle\langle k|;`
:math:`j, k \in \{0, 1, 2\}, j < k`.

**Details:**

* Number of wires: 1
* Number of parameters: 1
* Number of dimensions per parameter: (0,)

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int] or int): the wire the operation acts on
    subspace (Sequence[int]): the 2D subspace on which to apply operation
    id (str or None): String representing the operation (optional)

**Example**

The specified subspace will determine which basis states the operation actually
applies to:

>>> qp.TRZ(0.5, wires=0, subspace=(0, 1)).matrix()
array([[0.96891242-0.24740396j, 0.        +0.j        , 0.        +0.j        ],
       [0.        +0.j        , 0.96891242+0.24740396j, 0.        +0.j        ],
       [0.        +0.j        , 0.        +0.j        , 1.        +0.j        ]])

>>> qp.TRZ(0.5, wires=0, subspace=(0, 2)).matrix()
array([[0.96891242-0.24740396j, 0.        +0.j        , 0.        +0.j        ],
       [0.        +0.j        , 1.        +0.j        , 0.        +0.j        ],
       [0.        +0.j        , 0.        +0.j        , 0.96891242+0.24740396j]])

>>> qp.TRZ(0.5, wires=0, subspace=(1, 2)).matrix()
array([[1.        +0.j        , 0.        +0.j        , 0.        +0.j        ],
       [0.        +0.j        , 0.96891242-0.24740396j, 0.        +0.j        ],
       [0.        +0.j        , 0.        +0.j        , 0.96891242+0.24740396j]])

### `subspace`

```python
def subspace(self)
```

The single-qutrit basis states which the operator acts on

This subspace determines which two single-qutrit basis states the operator acts on.
The remaining basis state is not affected by the operator.

Returns:
    tuple[int]: subspace on which operator acts

### `compute_matrix`

```python
def compute_matrix(theta, subspace=(0, 1))
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.TRZ.matrix`

Args:
    theta (tensor_like or float): rotation angle
    subspace (Sequence[int]): the 2D subspace on which to apply operation

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.TRZ.compute_matrix(torch.tensor(0.5), subspace=(0, 2))
tensor([[0.9689-0.2474j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 1.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000+0.0000j, 0.9689+0.2474j]])
