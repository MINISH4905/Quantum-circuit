---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/qutrit/matrix_ops.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/qutrit/matrix_ops.py
license: Apache-2.0
---

## Module `pennylane/ops/qutrit/matrix_ops.py`

This submodule contains the qutrit quantum operations that
accept a unitary matrix as a parameter.

## `QutritUnitary`

```python
class QutritUnitary(Operation)
```

Apply an arbitrary, fixed unitary matrix.

**Details:**

* Number of wires: Any (the operation can act on any number of wires)
* Number of parameters: 1
* Gradient recipe: None

Args:
    U (array[complex]): square unitary matrix
    wires(Sequence[int] or int): the wire(s) the operation acts on
    id (str): custom label given to an operator instance,
        can be useful for some applications where the instance has to be identified.

**Example**

>>> dev = qp.device('default.qutrit', wires=1)
>>> U = np.array([[1, 1, 0], [1, -1, 0], [0, 0, np.sqrt(2)]]) / np.sqrt(2)
>>> @qp.qnode(dev)
... def example_circuit():
...     qp.QutritUnitary(U, wires=0)
...     return qp.state()
>>> print(example_circuit())
[0.70710678+0.j 0.70710678+0.j 0.        +0.j]

### `compute_matrix`

```python
def compute_matrix(U)
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.QutritUnitary.matrix`

Args:
    U (tensor_like): unitary matrix

Returns:
    tensor_like: canonical matrix

**Example**

>>> U = np.array([[1, 1, 0], [1, -1, 0], [0, 0, np.sqrt(2)]]) / np.sqrt(2)
>>> qp.QutritUnitary.compute_matrix(U)
array([[ 0.70710678,  0.70710678,  0.        ],
       [ 0.70710678, -0.70710678,  0.        ],
       [ 0.        ,  0.        ,  1.        ]])

## `ControlledQutritUnitary`

```python
class ControlledQutritUnitary(QutritUnitary)
```

ControlledQutritUnitary(U, control_wires, wires, control_values)
Apply an arbitrary fixed unitary to ``wires`` with control from the ``control_wires``.

In addition to default ``Operation`` instance attributes, the following are
available for ``ControlledQutritUnitary``:

* ``control_wires``: wires that act as control for the operation
* ``U``: unitary applied to the target wires. Accessible via ``op.parameters[0]``
* ``control_values``: a string of trits representing the state of the control
  qutrits to control on (default is the all 2s state)

**Details:**

* Number of wires: Any (the operation can act on any number of wires)
* Number of parameters: 1
* Gradient recipe: None

Args:
    U (array[complex]): square unitary matrix
    control_wires (Union[Wires, Sequence[int], or int]): the control wire(s)
    wires (Union[Wires, Sequence[int], or int]): the wire(s) the unitary acts on
    control_values (str): a string of trits representing the state of the control
        qutrits to control on (default is the all 2s state)

**Example**

The following shows how a single-qutrit unitary can be applied to wire ``2`` with control on
both wires ``0`` and ``1``:

>>> U = np.array([[1, 1, 0], [1, -1, 0], [0, 0, np.sqrt(2)]]) / np.sqrt(2)
>>> qp.ControlledQutritUnitary(U, control_wires=[0, 1], wires=2)
ControlledQutritUnitary(array([[ 0.70710678,  0.70710678,  0.        ],
       [ 0.70710678, -0.70710678,  0.        ],
       [ 0.        ,  0.        ,  1.        ]]), wires=[0, 1, 2])

By default, controlled operations apply the desired gate if the control qutrit(s)
are all in the state :math:`\vert 2\rangle`. However, there are some situations where
it is necessary to apply a gate conditioned on all control qutrits being in the
:math:`\vert 0\rangle` or :math:`\vert 1\rangle` state, or a mix of the three.

The state on which to control can be changed by passing a string of trits to
``control_values``. For example, if we want to apply a single-qutrit unitary to
wire ``3`` conditioned on three wires where the first is in state ``0``, the
second is in state ``1``, and the third in state ``2``, we can write:

>>> qp.ControlledQutritUnitary(U, control_wires=[0, 1, 2], wires=3, control_values='012')
ControlledQutritUnitary(array([[ 0.70710678,  0.70710678,  0.        ],
       [ 0.70710678, -0.70710678,  0.        ],
       [ 0.        ,  0.        ,  1.        ]]), wires=[0, 1, 2, 3])

### `compute_matrix`

```python
def compute_matrix(U, control_wires, u_wires, control_values=None)
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

Args:
    U (tensor_like): unitary matrix
    control_wires (Iterable): the control wire(s)
    u_wires (Iterable): the wire(s) the unitary acts on
    control_values (str or None): a string of trits representing the state of the control
        qutrits to control on (default is the all 2s state)

Returns:
    tensor_like: canonical matrix

**Example**

>>> U = np.array([[1, 1, 0], [1, -1, 0], [0, 0, np.sqrt(2)]]) / np.sqrt(2)
>>> qp.ControlledQutritUnitary.compute_matrix(U, control_wires=[0], u_wires=[1], control_values="1")
array([[ 1.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j],
       [ 0.        +0.j,  1.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j],
       [ 0.        +0.j,  0.        +0.j,  1.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j],
       [ 0.        +0.j,  0.        +0.j,  0.        +0.j,  0.70710678+0.j,  0.70710678+0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j],
       [ 0.        +0.j,  0.        +0.j,  0.        +0.j,  0.70710678+0.j, -0.70710678+0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j],
       [ 0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  1.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j],
       [ 0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  1.        +0.j,  0.        +0.j,  0.        +0.j],
       [ 0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  1.        +0.j,  0.        +0.j],
       [ 0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  0.        +0.j,  1.        +0.j]])

### `control_values`

```python
def control_values(self)
```

str. Specifies whether or not to control on zero "0", one "1", or two "2" for each
control wire.
