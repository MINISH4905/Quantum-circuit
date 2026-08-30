---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/adjoint.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/adjoint.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/adjoint.py`

This submodule defines the symbolic operation that indicates the adjoint of an operator.

## `adjoint`

```python
def adjoint(fn, lazy=True)
```

Create the adjoint of an Operator or a function that applies the adjoint of the provided function.
:func:`~.qjit` compatible.

Args:
    fn (function or :class:`~.operation.Operator`): A single operator or a quantum function that
        applies quantum operations.

Keyword Args:
    lazy=True (bool): If the transform is behaving lazily, all operations are wrapped in a ``Adjoint`` class
        and handled later. If ``lazy=False``, operation-specific adjoint decompositions are first attempted.
        Setting ``lazy=False`` is not supported when used with :func:`~.qjit`.

Returns:
    (function or :class:`~.operation.Operator`): If an Operator is provided, returns an Operator that is the adjoint.
    If a function is provided, returns a function with the same call signature that returns the Adjoint of the
    provided function.

.. note::

    The adjoint and inverse are identical for unitary gates, but not in general. For example, quantum channels and
    observables may have different adjoint and inverse operators.

.. note::

    When used with :func:`~.qjit`, this function only supports the Catalyst compiler.
    See :func:`catalyst.adjoint` for more details.

    Please see the Catalyst :doc:`quickstart guide <catalyst:dev/quick_start>`,
    as well as the :doc:`sharp bits and debugging tips <catalyst:dev/sharp_bits>`
    page for an overview of the differences between Catalyst and PennyLane.

.. note::

    This function supports a batched operator:

    >>> op = qp.adjoint(qp.RX([1, 2, 3], wires=0))
    >>> qp.matrix(op).shape
    (3, 2, 2)

    But it doesn't support batching of operators:

    >>> op = qp.adjoint([qp.RX(1, wires=0), qp.RX(2, wires=0)])
    Traceback (most recent call last):
        ...
    ValueError: The object [RX(1, wires=[0]), RX(2, wires=[0])] of type <class 'list'> is not callable.
    This error might occur if you apply adjoint to a list of operations instead of a function or template.

.. seealso:: :class:`~.ops.op_math.Adjoint` and :meth:`.Operator.adjoint`

**Example**

The adjoint transform can accept a single operator.

>>> @qp.qnode(qp.device('default.qubit', wires=1))
... def circuit2(y):
...     qp.adjoint(qp.RY(y, wires=0))
...     return qp.expval(qp.Z(0))
>>> print(qp.draw(circuit2)("y"))
0: ──RY(y)†─┤  <Z>
>>> print(qp.draw(circuit2, level="device")(0.1))
0: ──RY(0.10)†─┤  <Z>

The adjoint transforms can also be used to apply the adjoint of
any quantum function.  In this case, ``adjoint`` accepts a single function and returns
a function with the same call signature.

We can create a QNode that applies the ``my_ops`` function followed by its adjoint:

.. code-block:: python

    def my_ops(a, wire):
        qp.RX(a, wires=wire)
        qp.SX(wire)

    dev = qp.device('default.qubit', wires=1)

    @qp.qnode(dev)
    def circuit(a):
        my_ops(a, wire=0)
        qp.adjoint(my_ops)(a, wire=0)
        return qp.expval(qp.Z(0))

Printing this out, we can see that the inverse quantum
function has indeed been applied:

>>> print(qp.draw(circuit)(0.2))
0: ──RX(0.20)──SX──SX†──RX(0.20)†─┤  <Z>

**Example with compiler**

The adjoint used in a compilation context can be applied on control flow.

.. code-block:: python

    dev = qp.device("lightning.qubit", wires=1)

    @qp.qjit
    @qp.qnode(dev)
    def workflow(theta, n, wires):
        def func():
            @qp.for_loop(0, n, 1)
            def loop_fn(i):
                qp.RX(theta, wires=wires)

            loop_fn()
        qp.adjoint(func)()
        return qp.probs()

>>> import jax.numpy as jnp
>>> workflow(jnp.pi/2, 3, 0)
Array([0.5, 0.5], dtype=float64)

.. warning::

    The Catalyst adjoint function does not support performing the adjoint
    of quantum functions that contain mid-circuit measurements.

.. details::
    :title: Lazy Evaluation

    When ``lazy=False``, the function first attempts operation-specific decomposition of the
    adjoint via the :meth:`.Operator.adjoint` method. Only if an Operator doesn't have
    an :meth:`.Operator.adjoint` method is the object wrapped with the :class:`~.ops.op_math.Adjoint`
    wrapper class.

    >>> qp.adjoint(qp.Z(0), lazy=False)
    Z(0)
    >>> qp.adjoint(qp.RX, lazy=False)(1.0, wires=0)
    RX(-1.0, wires=[0])
    >>> qp.adjoint(qp.S, lazy=False)(0)
    Adjoint(S(0))

## `create_adjoint_op`

```python
def create_adjoint_op(fn, lazy)
```

Main logic for qp.adjoint, but allows bypassing the compiler dispatch if needed.

## `Adjoint`

```python
class Adjoint(SymbolicOp)
```

The Adjoint of an operator.

Args:
    base (~.operation.Operator): The operator that is adjointed.

.. seealso:: :func:`~.adjoint`, :meth:`~.operation.Operator.adjoint`

This is a *developer*-facing class, and the :func:`~.adjoint` transform should be used to
construct instances
of this class.

**Example**

>>> op = Adjoint(qp.S(0))
>>> op.name
'Adjoint(S)'
>>> qp.matrix(op)
array([[1.-0.j, 0.-0.j],
   [0.-0.j, 0.-1.j]])
>>> qp.generator(Adjoint(qp.RX(1.0, wires=0)))
(X(0), np.float64(0.5))
>>> Adjoint(qp.RX(1.234, wires=0)).data
(1.234,)

.. details::
    :title: Developer Details

    This class mixes in parent classes based on the inheritance tree of the provided ``Operator``.
    For example, when provided an ``Operation``, the instance will inherit from ``Operation`` and
    the ``AdjointOperation`` mixin.

    >>> op = Adjoint(qp.RX(1.234, wires=0))
    >>> isinstance(op, qp.operation.Operation)
    True
    >>> isinstance(op, AdjointOperation)
    True
    >>> op.grad_method
    'A'

### `__new__`

```python
def __new__(cls, base=None, id=None)
```

Returns an uninitialized type with the necessary mixins.

If the ``base`` is an ``Operation``, this will return an instance of ``AdjointOperation``.

## `AdjointOperation`

```python
class AdjointOperation(Adjoint, Operation)
```

This mixin class is dynamically added to an ``Adjoint`` instance if the provided base class
is an ``Operation``.

.. warning::
    This mixin class should never be initialized independent of ``Adjoint``.

Overriding the dunder method ``__new__`` in ``Adjoint`` allows us to customize the creation of
an instance and dynamically add in parent classes.

.. note:: Once the ``Operation`` class does not contain any unique logic any more, this mixin
class can be removed.
