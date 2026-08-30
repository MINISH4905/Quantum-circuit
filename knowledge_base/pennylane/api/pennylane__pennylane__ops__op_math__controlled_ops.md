---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/controlled_ops.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/controlled_ops.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/controlled_ops.py`

This submodule contains controlled operators based on the ControlledOp class.

## `ControlledQubitUnitary`

```python
class ControlledQubitUnitary(ControlledOp)
```

ControlledQubitUnitary(U, wires)
Apply an arbitrary fixed unitary matrix ``U`` to ``wires``. If ``n = len(wires) `` and ``U`` has ``k`` wires, then the first ``n - k`` from ``wires`` serve as control, and ``U`` lives on the last ``k`` wires.

In addition to default ``Operation`` instance attributes, the following are
available for ``ControlledQubitUnitary``:

* ``wires``: wires of the final controlled unitary, consisting of control wires following by target wires
* ``control_values``: the state on which to apply the controlled operation (see below)
* ``work_wires``: wires made use of during the decomposition of the operation into native operations

**Details:**

* Number of wires: Any (the operation can act on any number of wires)
* Number of parameters: 1
* Number of dimensions per parameter: (2,)
* Gradient recipe: None

Args:
    base (array[complex]): a square unitary matrix that will be used to construct a QubitUnitary
        operator, used as the base operator.
    wires (Union[Wires, Sequence[int], or int]): the wires the full
        controlled unitary acts on, composed of the controlled wires followed
        by the target wire.
    control_values (List[int or bool]): a list providing the state of the control qubits to
        control on (default is the all 1s state).
    unitary_check (bool): whether to check whether an array U is unitary when creating the
        operator (default False).
    work_wires (Union[Wires, Sequence[int], or int]): auxiliary wire(s) that may be utilized during
        the decomposition of the operator into native operations.

**Example**

The following shows how a single-qubit unitary can be applied to wire ``2`` with control on
both wires ``0`` and ``1``:

>>> U = np.array([[ 0.94877869,  0.31594146], [-0.31594146,  0.94877869]])
>>> qp.ControlledQubitUnitary(U, wires=[0, 1, 2])
Controlled(QubitUnitary(array([[ 0.948...,  0.3159...],
    [-0.3159...,  0.948...]]), wires=[2]), control_wires=[0, 1])

Typically, controlled operations apply a desired gate if the control qubits
are all in the state :math:`\vert 1\rangle`. However, there are some situations where
it is necessary to apply a gate conditioned on all qubits being in the
:math:`\vert 0\rangle` state, or a mix of the two.

The state on which to control can be changed by passing a string of bits to
`control_values`. For example, if we want to apply a single-qubit unitary to
wire ``3`` conditioned on three wires where the first is in state ``0``, the
second is in state ``1``, and the third in state ``1``, we can write:

>>> qp.ControlledQubitUnitary(U, wires=[0, 1, 2, 3], control_values=[0, 1, 1])
Controlled(QubitUnitary(array([[ 0.948...,  0.3159...],
       [-0.3159...,  0.948...]]), wires=[3]), control_wires=[0, 1, 2], control_values=[False, True, True])

or

>>> qp.ControlledQubitUnitary(U, wires=[0, 1, 2, 3], control_values=[False, True, True])
Controlled(QubitUnitary(array([[ 0.948...,  0.3159...],
       [-0.3159...,  0.948...]]), wires=[3]), control_wires=[0, 1, 2], control_values=[False, True, True])

## `CH`

```python
class CH(ControlledOp)
```

CH(wires)
The controlled-Hadamard operator

.. math:: CH = \begin{bmatrix}
        1 & 0 & 0 & 0 \\
        0 & 1 & 0 & 0 \\
        0 & 0 & \frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\
        0 & 0 & \frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}}
    \end{bmatrix}.

.. note:: The first wire provided corresponds to the **control qubit**.

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

.. seealso:: :meth:`~.CH.matrix`


Returns:
    ndarray: matrix

**Example**

>>> print(qp.CH.compute_matrix())
[[ 1.          0.          0.          0.        ]
 [ 0.          1.          0.          0.        ]
 [ 0.          0.          0.707...  0.707...]
 [ 0.          0.          0.707... -0.707...]]

### `compute_decomposition`

```python
def compute_decomposition(wires)
```

Representation of the operator as a product of other operators (static method).


.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.CH.decomposition`.

Args:
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> print(qp.CH.compute_decomposition([0, 1]))
[RY(-0.7853981633974483, wires=[1]), CZ(wires=[0, 1]), RY(0.7853981633974483, wires=[1])]

## `CY`

```python
class CY(ControlledOp)
```

CY(wires)
The controlled-Y operator

.. math:: CY = \begin{bmatrix}
        1 & 0 & 0 & 0 \\
        0 & 1 & 0 & 0\\
        0 & 0 & 0 & -i\\
        0 & 0 & i & 0
    \end{bmatrix}.

.. note:: The first wire provided corresponds to the **control qubit**.

**Details:**

* Number of wires: 2
* Number of parameters: 0

Args:
    wires (Sequence[int]): the wires the operation acts on
    id (str): custom label given to an operator instance,
        can be useful for some applications where the instance has to be identified.

### `compute_matrix`

```python
def compute_matrix()
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.CY.matrix`


Returns:
    ndarray: matrix

**Example**

>>> print(qp.CY.compute_matrix())
[[ 1.+0.j  0.+0.j  0.+0.j  0.+0.j]
 [ 0.+0.j  1.+0.j  0.+0.j  0.+0.j]
 [ 0.+0.j  0.+0.j  0.+0.j -0.-1.j]
 [ 0.+0.j  0.+0.j  0.+1.j  0.+0.j]]

### `compute_decomposition`

```python
def compute_decomposition(wires)
```

Representation of the operator as a product of other operators (static method).


.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.CY.decomposition`.

Args:
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> print(qp.CY.compute_decomposition([0, 1]))
[CRY(3.141592653589793, wires=[0, 1])), S(0)]

## `CZ`

```python
class CZ(ControlledOp)
```

CZ(wires)
The controlled-Z operator

.. math:: CZ = \begin{bmatrix}
        1 & 0 & 0 & 0 \\
        0 & 1 & 0 & 0\\
        0 & 0 & 1 & 0\\
        0 & 0 & 0 & -1
    \end{bmatrix}.

.. note:: The first wire provided corresponds to the **control qubit**.

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

.. seealso:: :meth:`~.CZ.matrix`

Returns:
    ndarray: matrix

**Example**

>>> print(qp.CZ.compute_matrix())
[[ 1  0  0  0]
 [ 0  1  0  0]
 [ 0  0  1  0]
 [ 0  0  0 -1]]

## `CSWAP`

```python
class CSWAP(ControlledOp)
```

CSWAP(wires)
The controlled-swap operator

.. math:: CSWAP = \begin{bmatrix}
        1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
        0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\
        0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 \\
        0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 \\
        0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 \\
        0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 \\
        0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 \\
        0 & 0 & 0 & 0 & 0 & 0 & 0 & 1
    \end{bmatrix}.

.. note:: The first wire provided corresponds to the **control qubit**.

**Details:**

* Number of wires: 3
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

.. seealso:: :meth:`~.CSWAP.matrix`

Returns:
    ndarray: matrix

**Example**

>>> print(qp.CSWAP.compute_matrix())
[[1 0 0 0 0 0 0 0]
 [0 1 0 0 0 0 0 0]
 [0 0 1 0 0 0 0 0]
 [0 0 0 1 0 0 0 0]
 [0 0 0 0 1 0 0 0]
 [0 0 0 0 0 0 1 0]
 [0 0 0 0 0 1 0 0]
 [0 0 0 0 0 0 0 1]]

### `compute_decomposition`

```python
def compute_decomposition(wires)
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.CSWAP.decomposition`.

Args:
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> print(qp.CSWAP.compute_decomposition((0,1,2)))
[CNOT(wires=[2, 1]), Toffoli(wires=[0, 1, 2]), CNOT(wires=[2, 1])]

## `CCZ`

```python
class CCZ(ControlledOp)
```

CCZ(wires)
CCZ (controlled-controlled-Z) gate.

.. math::

    CCZ =
    \begin{pmatrix}
    1 & 0 & 0 & 0 & 0 & 0 & 0 & 0\\
    0 & 1 & 0 & 0 & 0 & 0 & 0 & 0\\
    0 & 0 & 1 & 0 & 0 & 0 & 0 & 0\\
    0 & 0 & 0 & 1 & 0 & 0 & 0 & 0\\
    0 & 0 & 0 & 0 & 1 & 0 & 0 & 0\\
    0 & 0 & 0 & 0 & 0 & 1 & 0 & 0\\
    0 & 0 & 0 & 0 & 0 & 0 & 1 & 0\\
    0 & 0 & 0 & 0 & 0 & 0 & 0 & -1
    \end{pmatrix}

**Details:**

* Number of wires: 3
* Number of parameters: 0

Args:
    wires (Sequence[int]): the subsystem the gate acts on

### `compute_matrix`

```python
def compute_matrix()
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.CCZ.matrix`


Returns:
    ndarray: matrix

**Example**

>>> print(qp.CCZ.compute_matrix())
[[ 1  0  0  0  0  0  0  0]
[ 0  1  0  0  0  0  0  0]
[ 0  0  1  0  0  0  0  0]
[ 0  0  0  1  0  0  0  0]
[ 0  0  0  0  1  0  0  0]
[ 0  0  0  0  0  1  0  0]
[ 0  0  0  0  0  0  1  0]
[ 0  0  0  0  0  0  0 -1]]

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.Toffoli.decomposition`.

Args:
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.CCZ.compute_decomposition((0,1,2))
[CNOT(wires=[1, 2]),
 Adjoint(T(2)),
 CNOT(wires=[0, 2]),
 T(2),
 CNOT(wires=[1, 2]),
 Adjoint(T(2)),
 CNOT(wires=[0, 2]),
 T(2),
 T(1),
 CNOT(wires=[0, 1]),
 H(2),
 T(0),
 Adjoint(T(1)),
 CNOT(wires=[0, 1]),
 H(2)]

## `CNOT`

```python
class CNOT(ControlledOp)
```

CNOT(wires)
The controlled-NOT operator

.. math:: CNOT = \begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & 1 & 0 & 0\\
    0 & 0 & 0 & 1\\
    0 & 0 & 1 & 0
    \end{bmatrix}.

.. note:: The first wire provided corresponds to the **control qubit**.

**Details:**

* Number of wires: 2
* Number of parameters: 0

Args:
    wires (Sequence[int]): the wires the operation acts on

### `compute_decomposition`

```python
def compute_decomposition(*params, wires=None, **hyperparameters)
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

.. note::
    Operations making up the decomposition should be queued within the
    ``compute_decomposition`` method.

.. seealso:: :meth:`~.Operator.decomposition`.

Args:
    *params (list): trainable parameters of the operator, as stored in the ``parameters`` attribute
    wires (Iterable[Any], Wires): wires that the operator acts on
    **hyperparams (dict): non-trainable hyperparameters of the operator, as stored in the ``hyperparameters`` attribute

Raises:
    qp.DecompositionUndefinedError

### `compute_matrix`

```python
def compute_matrix()
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.CNOT.matrix`


Returns:
    ndarray: matrix

**Example**

>>> print(qp.CNOT.compute_matrix())
[[1 0 0 0]
 [0 1 0 0]
 [0 0 0 1]
 [0 0 1 0]]

## `Toffoli`

```python
class Toffoli(ControlledOp)
```

Toffoli(wires)
Toffoli (controlled-controlled-X) gate.

.. math::

    Toffoli =
    \begin{pmatrix}
    1 & 0 & 0 & 0 & 0 & 0 & 0 & 0\\
    0 & 1 & 0 & 0 & 0 & 0 & 0 & 0\\
    0 & 0 & 1 & 0 & 0 & 0 & 0 & 0\\
    0 & 0 & 0 & 1 & 0 & 0 & 0 & 0\\
    0 & 0 & 0 & 0 & 1 & 0 & 0 & 0\\
    0 & 0 & 0 & 0 & 0 & 1 & 0 & 0\\
    0 & 0 & 0 & 0 & 0 & 0 & 0 & 1\\
    0 & 0 & 0 & 0 & 0 & 0 & 1 & 0
    \end{pmatrix}

**Details:**

* Number of wires: 3
* Number of parameters: 0

Args:
    wires (Sequence[int]): the subsystem the gate acts on

### `compute_matrix`

```python
def compute_matrix()
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.Toffoli.matrix`


Returns:
    ndarray: matrix

**Example**

>>> print(qp.Toffoli.compute_matrix())
[[1 0 0 0 0 0 0 0]
 [0 1 0 0 0 0 0 0]
 [0 0 1 0 0 0 0 0]
 [0 0 0 1 0 0 0 0]
 [0 0 0 0 1 0 0 0]
 [0 0 0 0 0 1 0 0]
 [0 0 0 0 0 0 0 1]
 [0 0 0 0 0 0 1 0]]

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.Toffoli.decomposition`.

Args:
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.Toffoli.compute_decomposition((0,1,2))
[H(2),
 CNOT(wires=[1, 2]),
 Adjoint(T(2)),
 CNOT(wires=[0, 2]),
 T(2),
 CNOT(wires=[1, 2]),
 Adjoint(T(2)),
 CNOT(wires=[0, 2]),
 T(2),
 T(1),
 CNOT(wires=[0, 1]),
 H(2),
 T(0),
 Adjoint(T(1)),
 CNOT(wires=[0, 1])]

## `MultiControlledX`

```python
class MultiControlledX(ControlledOp)
```

Apply a :class:`~.PauliX` gate controlled on an arbitrary computational basis state.

**Details:**

* Number of wires: Any (the operation can act on any number of wires)
* Number of parameters: 0
* Gradient recipe: None

Args:
    wires (Union[Wires, Sequence[int], or int]): control wire(s) followed by a single target wire (the last entry of ``wires``) where
        the operation acts on
    control_values (Union[bool, list[bool], int, list[int]]): The value(s) the control wire(s)
        should take. Integers other than 0 or 1 will be treated as :code:`int(bool(x))`.
    work_wires (Union[Wires, Sequence[int], or int]): optional work wires used to decompose
        the operation into a series of :class:`~.Toffoli` gates
    work_wire_type (str): whether the work wires are ``"zeroed"`` or ``"borrowed"``. ``"zeroed"`` indicates that
        the work wires are in the state :math:`|0\rangle`, while ``"borrowed"`` indicates that the
        work wires are in an arbitrary state. Defaults to ``"borrowed"``.

.. note::

    If :class:`~.MultiControlledX` is not supported on the targeted device, PennyLane will decompose
    the operation into :class:`~.Toffoli` and/or :class:`~.CNOT` gates. When controlling on
    three or more wires, the Toffoli-based decompositions described in Lemmas 7.2 of
    `Barenco et al. <https://arxiv.org/abs/quant-ph/9503016>`__ and Sec 5 of `Khattar and Gidney
    <https://arxiv.org/abs/2407.17966>`__  will be used. These methods require at least one
    work wire.

    The number of work wires provided determines the decomposition method used and the resulting
    number of Toffoli gates required. When :class:`~.MultiControlledX` is controlling on :math:`n`
    wires:

    #. If at least :math:`n - 2` work wires are provided, the decomposition in Lemma 7.2 will be
       applied using the first :math:`n - 2` work wires.
    #. If at least :math:`2` work wires are provided, Sec. 5.2 and 5.4 of Khattar and Gidney
       will be used depending on whether the ``work_wire_type`` is ``"zeroed"`` or ``"borrowed"``.
    #. If at least :math:`1` work wire is provided, Sec. 5.1 and 5.3 of Khattar and Gidney
       will be used depending on whether the ``work_wire_type`` is ``"zeroed"`` or ``"borrowed"``.

    These methods present a tradeoff between qubit number and depth. The method in point 1
    requires fewer Toffoli gates but a greater number of qubits.

    Note that the state of the work wires before and after the decomposition takes place is
    unchanged.

### `compute_matrix`

```python
def compute_matrix(control_wires: WiresLike, control_values=None, **kwargs)
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.MultiControlledX.matrix`

Args:
    control_wires (Any or Iterable[Any]): wires to place controls on
    control_values (Union[bool, list[bool], int, list[int]]): The value(s) the control wire(s)
        should take. Integers other than 0 or 1 will be treated as ``int(bool(x))``.

Returns:
    tensor_like: matrix representation

**Example**

>>> print(qp.MultiControlledX.compute_matrix([0], [1]))
[[1. 0. 0. 0.]
 [0. 1. 0. 0.]
 [0. 0. 0. 1.]
 [0. 0. 1. 0.]]
>>> print(qp.MultiControlledX.compute_matrix([1], [0]))
[[0. 1. 0. 0.]
 [1. 0. 0. 0.]
 [0. 0. 1. 0.]
 [0. 0. 0. 1.]]

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike=None, work_wires: WiresLike=None, control_values=None, work_wire_type: Literal['zeroed', 'borrowed']='borrowed', **kwargs)
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.MultiControlledX.decomposition`.

Args:
    wires (Iterable[Any] or Wires): wires that the operation acts on
    work_wires (Wires): optional work wires used to decompose
        the operation into a series of Toffoli gates.
    control_values (Union[bool, list[bool], int, list[int]]): The value(s) the control wire(s)
        should take. Integers other than 0 or 1 will be treated as ``int(bool(x))``.
    work_wire_type (str): whether the work wires are zeroed or borrowed.

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

.. code-block:: python

    decomp = qp.MultiControlledX.compute_decomposition(wires=[0,1,2,3], control_values=[1,1,1], work_wires=qp.wires.Wires("aux"))

>>> print(decomp)
[Toffoli(wires=[0, 'aux', 3]), Toffoli(wires=[2, 1, 'aux']), Toffoli(wires=[0, 'aux', 3]), Toffoli(wires=[2, 1, 'aux'])]

## `CRX`

```python
class CRX(ControlledOp)
```

The controlled-RX operator

.. math::

    \begin{align}
        CR_x(\phi) &=
        \begin{bmatrix}
        & 1 & 0 & 0 & 0 \\
        & 0 & 1 & 0 & 0\\
        & 0 & 0 & \cos(\phi/2) & -i\sin(\phi/2)\\
        & 0 & 0 & -i\sin(\phi/2) & \cos(\phi/2)
        \end{bmatrix}.
    \end{align}

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: The controlled-RX operator satisfies a four-term parameter-shift rule
  (see Appendix F, https://doi.org/10.1088/1367-2630/ac2cb3):

  .. math::

      \frac{d}{d\phi}f(CR_x(\phi)) = c_+ \left[f(CR_x(\phi+a)) - f(CR_x(\phi-a))\right] - c_- \left[f(CR_x(\phi+b)) - f(CR_x(\phi-b))\right]

  where :math:`f` is an expectation value depending on :math:`CR_x(\phi)`, and

  - :math:`a = \pi/2`
  - :math:`b = 3\pi/2`
  - :math:`c_{\pm} = (\sqrt{2} \pm 1)/{4\sqrt{2}}`

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int]): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(theta)
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.CRX.matrix`

Args:
    theta (tensor_like or float): rotation angle

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.CRX.compute_matrix(torch.tensor(0.5))
tensor([[1.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 1.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000+0.0000j, 0.9689+0.0000j, 0.0000-0.2474j],
        [0.0000+0.0000j, 0.0000+0.0000j, 0.0000-0.2474j, 0.9689+0.0000j]])

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.CRot.decomposition`.

Args:
    phi (TensorLike): rotation angle :math:`\phi`
    wires (Iterable, Wires): the wires the operation acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.CRX.compute_decomposition(1.2, wires=(0,1))
[RZ(np.float64(1.5707963267948966), wires=[1]), RY(0.6, wires=[1]), CNOT(wires=[0, 1]), RY(-0.6, wires=[1]), CNOT(wires=[0, 1]), RZ(np.float64(-1.5707963267948966), wires=[1])]

## `CRY`

```python
class CRY(ControlledOp)
```

The controlled-RY operator

.. math::

    \begin{align}
        CR_y(\phi) &=
        \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0\\
            0 & 0 & \cos(\phi/2) & -\sin(\phi/2)\\
            0 & 0 & \sin(\phi/2) & \cos(\phi/2)
        \end{bmatrix}.
    \end{align}

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: The controlled-RY operator satisfies a four-term parameter-shift rule
  (see Appendix F, https://doi.org/10.1088/1367-2630/ac2cb3):

  .. math::

      \frac{d}{d\phi}f(CR_y(\phi)) = c_+ \left[f(CR_y(\phi+a)) - f(CR_y(\phi-a))\right] - c_- \left[f(CR_y(\phi+b)) - f(CR_y(\phi-b))\right]

  where :math:`f` is an expectation value depending on :math:`CR_y(\phi)`, and

  - :math:`a = \pi/2`
  - :math:`b = 3\pi/2`
  - :math:`c_{\pm} = (\sqrt{2} \pm 1)/{4\sqrt{2}}`

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int]): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(theta)
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.CRY.matrix`


Args:
    theta (tensor_like or float): rotation angle

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.CRY.compute_matrix(torch.tensor(0.5))
tensor([[ 1.0000+0.j,  0.0000+0.j,  0.0000+0.j,  0.0000+0.j],
        [ 0.0000+0.j,  1.0000+0.j,  0.0000+0.j,  0.0000+0.j],
        [ 0.0000+0.j,  0.0000+0.j,  0.9689+0.j, -0.2474-0.j],
        [ 0.0000+0.j,  0.0000+0.j,  0.2474+0.j,  0.9689+0.j]])

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.CRY.decomposition`.

Args:
    phi (TensorLike): rotation angle :math:`\phi`
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.CRY.compute_decomposition(1.2, wires=(0,1))
[RY(0.6, wires=[1]),
CNOT(wires=[0, 1]),
RY(-0.6, wires=[1]),
CNOT(wires=[0, 1])]

## `CRZ`

```python
class CRZ(ControlledOp)
```

The controlled-RZ operator

.. math::

    \begin{align}
         CR_z(\phi) &=
         \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0\\
            0 & 0 & e^{-i\phi/2} & 0\\
            0 & 0 & 0 & e^{i\phi/2}
        \end{bmatrix}.
    \end{align}


.. note:: The subscripts of the operations in the formula refer to the wires they act on, e.g. 1 corresponds
    to the first element in ``wires`` that is the **control qubit**.

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: The controlled-RZ operator satisfies a four-term parameter-shift rule
  (see Appendix F, https://doi.org/10.1088/1367-2630/ac2cb3):

  .. math::

      \frac{d}{d\phi}f(CR_z(\phi)) = c_+ \left[f(CR_z(\phi+a)) - f(CR_z(\phi-a))\right] - c_- \left[f(CR_z(\phi+b)) - f(CR_z(\phi-b))\right]

  where :math:`f` is an expectation value depending on :math:`CR_z(\phi)`, and

  - :math:`a = \pi/2`
  - :math:`b = 3\pi/2`
  - :math:`c_{\pm} = (\sqrt{2} \pm 1)/{4\sqrt{2}}`

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int]): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(theta)
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.CRZ.matrix`

Args:
    theta (tensor_like or float): rotation angle

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.CRZ.compute_matrix(torch.tensor(0.5))
tensor([[1.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 1.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000+0.0000j, 0.9689-0.2474j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j, 0.9689+0.2474j]])

### `compute_eigvals`

```python
def compute_eigvals(theta, **_)
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.CRZ.eigvals`


Args:
    theta (tensor_like or float): rotation angle

Returns:
    tensor_like: eigenvalues

**Example**

>>> qp.CRZ.compute_eigvals(torch.tensor(0.5))
tensor([1.0000+0.0000j, 1.0000+0.0000j, 0.9689-0.2474j, 0.9689+0.2474j])

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.CRZ.decomposition`.

Args:
    phi (TensorLike): rotation angle :math:`\phi`
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.CRZ.compute_decomposition(1.2, wires=(0,1))
[PhaseShift(0.6, wires=[1]),
CNOT(wires=[0, 1]),
PhaseShift(-0.6, wires=[1]),
CNOT(wires=[0, 1])]

## `CRot`

```python
class CRot(ControlledOp)
```

The controlled-Rot operator

.. math:: CR(\phi, \theta, \omega) = \begin{bmatrix}
        1 & 0 & 0 & 0 \\
        0 & 1 & 0 & 0\\
        0 & 0 & e^{-i(\phi+\omega)/2}\cos(\theta/2) & -e^{i(\phi-\omega)/2}\sin(\theta/2)\\
        0 & 0 & e^{-i(\phi-\omega)/2}\sin(\theta/2) & e^{i(\phi+\omega)/2}\cos(\theta/2)
    \end{bmatrix}.

.. note:: The first wire provided corresponds to the **control qubit**.

**Details:**

* Number of wires: 2
* Number of parameters: 3
* Number of dimensions per parameter: (0, 0, 0)
* Gradient recipe: The controlled-Rot operator satisfies a four-term parameter-shift rule
  (see Appendix F, https://doi.org/10.1088/1367-2630/ac2cb3):

  .. math::

      \frac{d}{d\mathbf{x}_i}f(CR(\mathbf{x}_i)) = c_+ \left[f(CR(\mathbf{x}_i+a)) - f(CR(\mathbf{x}_i-a))\right] - c_- \left[f(CR(\mathbf{x}_i+b)) - f(CR(\mathbf{x}_i-b))\right]

  where :math:`f` is an expectation value depending on :math:`CR(\mathbf{x}_i)`, and

  - :math:`\mathbf{x} = (\phi, \theta, \omega)` and `i` is an index to :math:`\mathbf{x}`
  - :math:`a = \pi/2`
  - :math:`b = 3\pi/2`
  - :math:`c_{\pm} = (\sqrt{2} \pm 1)/{4\sqrt{2}}`

Args:
    phi (float): rotation angle :math:`\phi`
    theta (float): rotation angle :math:`\theta`
    omega (float): rotation angle :math:`\omega`
    wires (Sequence[int]): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(phi, theta, omega)
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.CRot.matrix`


Args:
    phi(tensor_like or float): first rotation angle
    theta (tensor_like or float): second rotation angle
    omega (tensor_like or float): third rotation angle

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.CRot.compute_matrix(torch.tensor(0.1), torch.tensor(0.2), torch.tensor(0.3))
tensor([[ 1.0000+0.0000j,  0.0000+0.0000j,  0.0000+0.0000j,  0.0000+0.0000j],
        [ 0.0000+0.0000j,  1.0000+0.0000j,  0.0000+0.0000j,  0.0000+0.0000j],
        [ 0.0000+0.0000j,  0.0000+0.0000j,  0.9752-0.1977j, -0.0993+0.0100j],
        [ 0.0000+0.0000j,  0.0000+0.0000j,  0.0993+0.0100j,  0.9752+0.1977j]])

### `compute_decomposition`

```python
def compute_decomposition(phi: TensorLike, theta: TensorLike, omega: TensorLike, wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.CRot.decomposition`.

Args:
    phi (TensorLike): rotation angle :math:`\phi`
    theta (TensorLike): rotation angle :math:`\theta`
    omega (TensorLike): rotation angle :math:`\omega`
    wires (Iterable, Wires): the wires the operation acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.CRot.compute_decomposition(1.234, 2.34, 3.45, wires=[0, 1])
[RZ(-1.108, wires=[1]),
 CNOT(wires=[0, 1]),
 RZ(-2.342, wires=[1]),
 RY(-1.17, wires=[1]),
 CNOT(wires=[0, 1]),
 RY(1.17, wires=[1]),
 RZ(3.45, wires=[1])]

## `ControlledPhaseShift`

```python
class ControlledPhaseShift(ControlledOp)
```

A qubit controlled phase shift.

.. math:: CR_\phi(\phi) = \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 0 & 1 & 0 \\
            0 & 0 & 0 & e^{i\phi}
        \end{bmatrix}.

.. note:: The first wire provided corresponds to the **control qubit**.

**Details:**

* Number of wires: 2
* Number of parameters: 1
* Number of dimensions per parameter: (0,)
* Gradient recipe: :math:`\frac{d}{d\phi}f(CR_\phi(\phi)) = \frac{1}{2}\left[f(CR_\phi(\phi+\pi/2)) - f(CR_\phi(\phi-\pi/2))\right]`
    where :math:`f` is an expectation value depending on :math:`CR_{\phi}(\phi)`.

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Sequence[int]): the wire the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_matrix`

```python
def compute_matrix(phi)
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.ControlledPhaseShift.matrix`

Args:
    phi (tensor_like or float): phase shift

Returns:
    tensor_like: canonical matrix

**Example**

>>> qp.ControlledPhaseShift.compute_matrix(torch.tensor(0.5))
tensor([[1.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 1.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000+0.0000j, 1.0000+0.0000j, 0.0000+0.0000j],
        [0.0000+0.0000j, 0.0000+0.0000j, 0.0000+0.0000j, 0.8776+0.4794j]])

### `compute_eigvals`

```python
def compute_eigvals(phi, **_)
```

Eigenvalues of the operator in the computational basis (static method).

If :attr:`diagonalizing_gates` are specified and implement a unitary :math:`U^{\dagger}`,
the operator can be reconstructed as

.. math:: O = U \Sigma U^{\dagger},

where :math:`\Sigma` is the diagonal matrix containing the eigenvalues.

Otherwise, no particular order for the eigenvalues is guaranteed.

.. seealso:: :meth:`~.ControlledPhaseShift.eigvals`


Args:
    phi (tensor_like or float): phase shift

Returns:
    tensor_like: eigenvalues

**Example**

>>> qp.ControlledPhaseShift.compute_eigvals(torch.tensor(0.5))
tensor([1.0000+0.0000j, 1.0000+0.0000j, 1.0000+0.0000j, 0.8776+0.4794j])

### `compute_decomposition`

```python
def compute_decomposition(phi, wires)
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.ControlledPhaseShift.decomposition`.

Args:
    phi (float): rotation angle :math:`\phi`
    wires (Iterable, Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.ControlledPhaseShift.compute_decomposition(1.234, wires=(0,1))
[PhaseShift(0.617, wires=[0]),
 CNOT(wires=[0, 1]),
 PhaseShift(-0.617, wires=[1]),
 CNOT(wires=[0, 1]),
 PhaseShift(0.617, wires=[1])]
