---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/controlled.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/controlled.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/controlled.py`

This submodule defines the symbolic operation that indicates the control of an operator.

## `ctrl`

```python
def ctrl(op, control: Any, control_values=None, work_wires=None, work_wire_type='borrowed')
```

Create a method that applies a controlled version of the provided op.
:func:`~.qjit` compatible.

.. note::

    When used with :func:`~.qjit`, this function only supports the Catalyst compiler.
    See :func:`catalyst.ctrl` for more details.

    Please see the Catalyst :doc:`quickstart guide <catalyst:dev/quick_start>`,
    as well as the :doc:`sharp bits and debugging tips <catalyst:dev/sharp_bits>`
    page for an overview of the differences between Catalyst and PennyLane.

Args:
    op (function or :class:`~.operation.Operator`): A single operator or a function that applies pennylane operators.
    control (Wires): The control wire(s).
    control_values (bool or int or list[bool or int]): The value(s) the control wire(s)
        should take. Integers other than 0 or 1 will be treated as ``int(bool(x))``.
    work_wires (Any): Any auxiliary wires that can be used in the decomposition
    work_wire_type: The type of work wire(s), can be ``"zeroed"`` or ``"borrowed"``. ``"zeroed"``
        indicates that the work wires are in the :math:`|0\rangle` state, whereas ``"borrowed"``
        work wires can be in any arbitrary state. Defaults to ``"borrowed"``.

Returns:
    function or :class:`~.operation.Operator`: If an Operator is provided, returns a Controlled version of the Operator.
    If a function is provided, returns a function with the same call signature that creates a controlled version of the
    provided function.

.. seealso:: :class:`~.Controlled`.

**Example**

.. code-block:: python

    @qp.qnode(qp.device('default.qubit', wires=range(4)))
    def circuit(x):
        qp.X(2)
        qp.ctrl(qp.RX, (1,2,3), control_values=(0,1,0))(x, wires=0)
        return qp.expval(qp.Z(0))

>>> print(qp.draw(circuit)("x"))
0: ────╭RX(x)─┤  <Z>
1: ────├○─────┤
2: ──X─├●─────┤
3: ────╰○─────┤
>>> x = qp.numpy.array(1.2, requires_grad=True)
>>> circuit(x)
tensor(0.362..., requires_grad=True)
>>> qp.grad(circuit)(x)
tensor(-0.932..., requires_grad=True)

:func:`~.ctrl` works on both callables like ``qp.RX`` or a quantum function
and individual :class:`~.operation.Operator`'s.

>>> qp.ctrl(qp.Hadamard(0), (1,2))
Controlled(H(0), control_wires=[1, 2])

Controlled operations work with all other forms of operator math and simplification:

>>> op = qp.ctrl(qp.RX(1.2, wires=0) ** 2 @ qp.RY(0.1, wires=0), control=1)
>>> qp.simplify(qp.adjoint(op))
Controlled(RY(12.466370614359173, wires=[0]) @ RX(10.166370614359172, wires=[0]), control_wires=[1])

**Example with compiler**

.. code-block:: python

    dev = qp.device("lightning.qubit", wires=2)

    @qp.qjit
    @qp.qnode(dev)
    def workflow(theta, w, cw):
        qp.Hadamard(wires=[0])
        qp.Hadamard(wires=[1])

        def func(arg):
            qp.RX(theta, wires=arg)

        def cond_fn():
            qp.RY(theta, wires=w)

        qp.ctrl(func, control=[cw])(w)
        qp.ctrl(qp.cond(theta > 0.0, cond_fn), control=[cw])()
        qp.ctrl(qp.RZ, control=[cw])(theta, wires=w)
        qp.ctrl(qp.RY(theta, wires=w), control=[cw])
        return qp.probs()

>>> workflow(jnp.pi/4, 1, 0)
Array([0.25      , 0.25      , 0.03661165, 0.46338835], dtype=float64)

## `create_controlled_op`

```python
def create_controlled_op(op, control, control_values=None, work_wires=None, work_wire_type='borrowed')
```

Default ``qp.ctrl`` implementation, allowing other implementations to call it when needed.

## `Controlled`

```python
class Controlled(SymbolicOp)
```

Symbolic operator denoting a controlled operator.

Args:
    base (~.operation.Operator): the operator that is controlled
    control_wires (Any): The wires to control on.

Keyword Args:
    control_values (Iterable[Bool]): The values to control on. Must be the same
        length as ``control_wires``. Defaults to ``True`` for all control wires.
        Provided values are converted to `Bool` internally.
    work_wires (Any): Any auxiliary wires that can be used in the decomposition
    work_wire_type: The type of work wire(s), can be ``"zeroed"`` or ``"borrowed"``. ``"zeroed"``
        indicates that the work wires are in the :math:`|0\rangle` state, whereas ``"borrowed"``
        work wires can be in any arbitrary state. Defaults to ``"borrowed"``.

.. seealso:: The :func:`~.ctrl` function is recommended for use over ``Controlled``.

.. note::
    This class, ``Controlled``, denotes a controlled version of any individual operation.
    :class:`~.ControlledOp` adds :class:`~.Operation` specific methods and properties to the
    more general ``Controlled`` class.

**Example**

>>> base = qp.RX(1.234, 1)
>>> Controlled(base, (0, 2, 3), control_values=[True, False, True])
Controlled(RX(1.234, wires=[1]), control_wires=[0, 2, 3], control_values=[True, False, True])
>>> op = Controlled(base, 0, control_values=[0])
>>> op
Controlled(RX(1.234, wires=[1]), control_wires=[0], control_values=[False])

The operation has both standard :class:`~.operation.Operator` properties
and ``Controlled`` specific properties:

>>> op.base
RX(1.234, wires=[1])
>>> op.data
(1.234,)
>>> op.wires
Wires([0, 1])
>>> op.control_wires
Wires([0])
>>> op.target_wires
Wires([1])

Control values are lists of booleans, indicating whether or not to control on the
``0==False`` value or the ``1==True`` wire.

>>> op.control_values
[False]

Provided control values are converted to booleans internally, so
any "truthy" or "falsy" objects work.

>>> Controlled(base, ("a", "b", "c"), control_values=["", None, 5]).control_values
[False, False, True]

Representations for an operator are available if the base class defines them.
Sparse matrices are available if the base class defines either a sparse matrix
or only a dense matrix.

>>> with np.printoptions(precision=4): # easier to read the matrix
...     qp.matrix(op)
array([[0.8156+0.j    , 0.    -0.5786j, 0.    +0.j    , 0.    +0.j    ],
       [0.    -0.5786j, 0.8156+0.j    , 0.    +0.j    , 0.    +0.j    ],
       [0.    +0.j    , 0.    +0.j    , 1.    +0.j    , 0.    +0.j    ],
       [0.    +0.j    , 0.    +0.j    , 0.    +0.j    , 1.    +0.j    ]])
>>> with np.printoptions(precision=4): # easier to read the matrix
...     qp.eigvals(op)
array([1.    +0.j    , 1.    +0.j    , 0.8156+0.5786j, 0.8156-0.5786j])
>>> print(qp.generator(op, format='observable'))
Projector(array([0]), wires=[0]) @ (-0.5 * X(1))
>>> op.sparse_matrix()
<Compressed Sparse Row sparse matrix of dtype 'complex128'
    with 6 stored elements and shape (4, 4)>

If the provided base matrix is an :class:`~.operation.Operation`, then the created
object will be of type :class:`~.ops.op_math.ControlledOp`. This class adds some additional
methods and properties to the basic :class:`~.ops.op_math.Controlled` class.

>>> type(op)
<class 'pennylane.ops.op_math.controlled.ControlledOp'>
>>> op.parameter_frequencies
[(np.float64(0.5), np.float64(1.0))]

### `__new__`

```python
def __new__(cls, *args, **kwargs)
```

Choose the concrete class to allocate for a controlled operator.

Operation bases should be allocated as ``ControlledOp`` instances, while
non-Operation operator bases should remain plain ``Controlled`` instances.

### `control_values`

```python
def control_values(self)
```

Iterable[Bool]. For each control wire, denotes whether to control on ``True`` or
``False``.

### `control_wires`

```python
def control_wires(self)
```

The control wires.

### `target_wires`

```python
def target_wires(self)
```

The wires of the target operator.

### `work_wires`

```python
def work_wires(self)
```

Additional wires that can be used in the decomposition. Not modified by the operation.

### `work_wire_type`

```python
def work_wire_type(self)
```

The type of work wires provided, can be ``"zeroed"`` or ``"borrowed"``.

## `ControlledOp`

```python
class ControlledOp(Controlled, Operation)
```

Operation-specific methods and properties for the :class:`~.ops.op_math.Controlled` class.

When an :class:`~.operation.Operation` is provided to the :class:`~.ops.op_math.Controlled`
class, this type is constructed instead. It adds some additional :class:`~.operation.Operation`
specific methods and properties.

.. seealso:: This class is mostly for internal use. Please see :class:`~.Controlled` instead.

## `base_to_custom_ctrl_op`

```python
def base_to_custom_ctrl_op()
```

A dictionary mapping base op types to their custom controlled versions.
This dictionary is used under the assumption that all custom controlled operations do not
have resource params (which is why `ControlledQubitUnitary` is not included here).
