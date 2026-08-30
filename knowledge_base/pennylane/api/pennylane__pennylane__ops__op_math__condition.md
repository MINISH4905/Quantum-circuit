---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/condition.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/condition.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/condition.py`

Contains the condition transform.

## `Conditional`

```python
class Conditional(SymbolicOp, Operation)
```

A Conditional Operation.

Unless you are a Pennylane plugin developer, **you should NOT directly use this class**,
instead, use the :func:`qp.cond <.cond>` function.

The ``Conditional`` class is a container class that defines an operation
that should be applied relative to a single measurement value.

Support for executing ``Conditional`` operations is device-dependent. If a
device doesn't support mid-circuit measurements natively, then the QNode
will apply the :func:`defer_measurements` transform.

Args:
    expr (qp.ops.MeasurementValue): the measurement outcome value to consider
    then_op (Operation): the PennyLane operation to apply conditionally
    id (str): custom label given to an operator instance,
        can be useful for some applications where the instance has to be identified

### `meas_val`

```python
def meas_val(self)
```

the measurement outcome value to consider from `expr` argument

## `CondCallable`

```python
class CondCallable
```

Base class to represent a conditional function with boolean predicates.

Args:
    condition (bool): a conditional expression
    true_fn (callable): The function to apply if ``condition`` is ``True``
    false_fn (callable): The function to apply if ``condition`` is ``False``
    elifs (List(Tuple(bool, callable))): A list of (bool, elif_fn) clauses.

Passing ``false_fn`` and ``elifs`` on initialization
is optional; these functions can be registered post-initialization
via decorators:

.. code-block:: python

    def f(x):
        @qp.cond(x > 0)
        def conditional(y):
            return y ** 2

        @conditional.else_if(x < -2)
        def conditional(y):
            return y

        @conditional.otherwise
        def conditional_false_fn(y):
            return -y

        return conditional(x + 1)

>>> [f(0.5), f(-3), f(-0.5)]
[2.25, -2, -0.5]

### `else_if`

```python
def else_if(self, pred)
```

Decorator that allows else-if functions to be registered with a corresponding
boolean predicate.

Args:
    pred (bool): The predicate that will determine if this branch is executed.

Returns:
    callable: decorator that is applied to the else-if function

### `otherwise`

```python
def otherwise(self, otherwise_fn)
```

Decorator that registers the function to be run if all
conditional predicates (including optional) evaluates to ``False``.

Args:
    otherwise_fn (callable): the function to apply if all ``self.preds`` evaluate to ``False``

### `false_fn`

```python
def false_fn(self)
```

callable: the function to apply if all ``self.preds`` evaluate to ``False``.

Alias for ``otherwise_fn``.

### `true_fn`

```python
def true_fn(self)
```

callable: the function to apply if all ``self.condition`` evaluate to ``True``

### `condition`

```python
def condition(self)
```

bool: the condition that determines if ``self.true_fn`` is applied

### `elifs`

```python
def elifs(self)
```

(List(Tuple(bool, callable))): a list of (bool, elif_fn) clauses

## `cond`

```python
def cond(condition: Union['qp.ops.MeasurementValue', bool], true_fn: Callable | None=None, false_fn: Callable | None=None, elifs: Sequence=())
```

Quantum-compatible if-else conditionals --- condition quantum operations
on parameters such as the results of mid-circuit qubit measurements.

This method is restricted to simply branching on mid-circuit measurement
results when it is not used with the :func:`~.qjit` decorator.

When used with the :func:`~.qjit` decorator, this function allows for general
if-elif-else constructs. All ``true_fn``, ``false_fn`` and ``elifs`` branches
will be captured by Catalyst, the just-in-time (JIT) compiler, with the executed
branch determined at runtime. For more details, please see :func:`catalyst.cond`.

.. note::

    With the Python interpreter, support for :func:`~.cond`
    is device-dependent. If a device doesn't
    support mid-circuit measurements natively, then the QNode will
    apply the :func:`defer_measurements` transform.

.. note::

    When used with :func:`~.qjit`, this function only supports
    the Catalyst compiler. See :func:`catalyst.cond` for more details.

    Please see the Catalyst :doc:`quickstart guide <catalyst:dev/quick_start>`,
    as well as the :doc:`sharp bits and debugging tips <catalyst:dev/sharp_bits>`.

.. note::

    When used with :func:`.pennylane.capture.enabled`, this function allows for general
    if-elif-else constructs. As with the JIT mode, all branches are captured,
    with the executed branch determined at runtime.

    Each branch can receive arguments, but the arguments must be JAX-compatible.
    If a branch returns one or more variables, every other branch must return the same abstract values.

Args:
    condition (Union[qp.ops.MeasurementValue, bool]): a conditional expression that may involve a mid-circuit
       measurement value (see :func:`.pennylane.measure`).
    true_fn (callable): The quantum function or PennyLane operation to
        apply if ``condition`` is ``True``
    false_fn (callable): The quantum function or PennyLane operation to
        apply if ``condition`` is ``False``
    elifs (Sequence(Tuple(bool, callable))): A sequence of (bool, elif_fn) clauses. Can only
        be used when decorated by :func:`~.qjit` or if the condition is not
        a mid-circuit measurement.

Returns:
    function: A new function that applies the conditional equivalent of ``true_fn``. The returned
    function takes the same input arguments as ``true_fn``.

**Example**

.. code-block:: python

    dev = qp.device("default.qubit", wires=3)

    @qp.qnode(dev)
    def qnode(x, y):
        qp.Hadamard(0)
        m_0 = qp.measure(0)
        qp.cond(m_0, qp.RY)(x, wires=1)

        qp.Hadamard(2)
        qp.RY(-np.pi/2, wires=[2])
        m_1 = qp.measure(2)
        qp.cond(m_1 == 0, qp.RX)(y, wires=1)
        return qp.expval(qp.Z(1))

>>> first_par = np.array(0.3)
>>> sec_par = np.array(1.23)
>>> qnode(first_par, sec_par)
np.float64(0.32...)

.. note::

    If the first argument of ``cond`` is a measurement value (e.g., ``m_0``
    in ``qp.cond(m_0, qp.RY)``), then ``m_0 == 1`` is considered
    internally.

.. warning::

    Expressions with boolean logic flow using operators like ``and``,
    ``or`` and ``not`` are not supported as the ``condition`` argument.

    While such statements may not result in errors, they may result in
    incorrect behaviour.

In just-in-time (JIT) mode using the :func:`~.qjit` decorator,

.. code-block:: python

    dev = qp.device("lightning.qubit", wires=1)

    @qp.qjit
    @qp.qnode(dev)
    def circuit(x: float):
        def ansatz_true():
            qp.RX(x, wires=0)

        def ansatz_false():
            qp.RY(x, wires=0)

        qp.cond(x > 1.4, ansatz_true, ansatz_false)()

        return qp.expval(qp.Z(0))

    ansatz_true = circuit(1.4)
    ansatz_false = circuit(1.6)

>>> jnp.allclose(ansatz_true, jnp.cos(1.4))
Array(True, dtype=bool)
>>> jnp.allclose(ansatz_false, jnp.cos(1.6))
Array(True, dtype=bool)

Additional 'else-if' clauses can also be included via the ``elif`` argument:

.. code-block:: python

    @qp.qjit
    @qp.qnode(dev)
    def circuit(x):

        def true_fn():
            qp.RX(x, wires=0)

        def elif_fn():
            qp.RY(x, wires=0)

        def false_fn():
            qp.RX(x ** 2, wires=0)

        qp.cond(x > 2.7, true_fn, false_fn, ((x > 1.4, elif_fn),))()
        return qp.expval(qp.Z(0))

>>> circuit(1.2)
Array(0.13042371, dtype=float64)

.. note::

    If the above syntax is used with a ``QNode`` that is not decorated with
    :func:`~pennylane.qjit` and none of the predicates contain mid-circuit measurements,
    ``qp.cond`` will fall back to using native Python ``if``-``elif``-``else`` blocks.

.. details::
    :title: Usage Details

    **Conditional quantum functions**

    The ``cond`` transform allows conditioning quantum functions too:

    .. code-block:: python

        dev = qp.device("default.qubit")

        def qfunc(par, wires):
            qp.Hadamard(wires[0])
            qp.RY(par, wires[0])

        @qp.qnode(dev)
        def qnode(x):
            qp.Hadamard(0)
            m_0 = qp.measure(0)
            qp.cond(m_0, qfunc)(x, wires=[1])
            return qp.expval(qp.Z(1))

    >>> par = np.array(0.3)
    >>> qnode(par)
    np.float64(0.35...)

    **Postprocessing multiple measurements into a condition**

    The Boolean condition for ``cond`` may consist of arithmetic expressions
    of one or multiple mid-circuit measurements:

    .. code-block:: python

        def cond_fn(mcms):
            first_term = np.prod(mcms)
            second_term = (2 ** np.arange(len(mcms))) @ mcms
            return (1 - first_term) * (second_term > 3)

        @qp.qnode(dev)
        def qnode(x):
            ...
            mcms = [qp.measure(w) for w in range(4)]
            qp.cond(cond_fn(mcms), qp.RX)(x, wires=4)
            ...
            return qp.expval(qp.Z(1))

    **Passing two quantum functions**

    In the qubit model, single-qubit measurements may result in one of two
    outcomes. Such measurement outcomes may then be used to create
    conditional expressions.

    According to the truth value of the conditional expression passed to
    ``cond``, the transform can apply a quantum function in both the
    ``True`` and ``False`` case:

    .. code-block:: python

        dev = qp.device("default.qubit", wires=2)

        def qfunc1(x, wires):
            qp.Hadamard(wires[0])
            qp.RY(x, wires[0])

        def qfunc2(x, wires):
            qp.Hadamard(wires[0])
            qp.RZ(x, wires[0])

        @qp.qnode(dev)
        def qnode1(x):
            qp.Hadamard(0)
            m_0 = qp.measure(0)
            qp.cond(m_0, qfunc1, qfunc2)(x, wires=[1])
            return qp.expval(qp.Z(1))

    >>> par = np.array(0.3)
    >>> qnode1(par)
    np.float64(-0.1477...)

    The previous QNode is equivalent to using ``cond`` twice, inverting the
    conditional expression in the second case using the ``~`` unary
    operator:

    .. code-block:: python

        @qp.qnode(dev)
        def qnode2(x):
            qp.Hadamard(0)
            m_0 = qp.measure(0)
            qp.cond(m_0, qfunc1)(x, wires=[1])
            qp.cond(~m_0, qfunc2)(x, wires=[1])
            return qp.expval(qp.Z(1))

    >>> qnode2(par)
    np.float64(-0.14776...)

    **Quantum functions with different signatures**

    It may be that the two quantum functions passed to ``qp.cond`` have
    different signatures. In such a case, ``lambda`` functions taking no
    arguments can be used with Python closure:

    .. code-block:: python

        dev = qp.device("default.qubit", wires=2)

        def qfunc1(x, wire):
            qp.Hadamard(wire)
            qp.RY(x, wire)

        def qfunc2(x, y, z, wire):
            qp.Hadamard(wire)
            qp.Rot(x, y, z, wire)

        @qp.qnode(dev)
        def qnode(a, x, y, z):
            qp.Hadamard(0)
            m_0 = qp.measure(0)
            qp.cond(m_0, lambda: qfunc1(a, wire=1), lambda: qfunc2(x, y, z, wire=1))()
            return qp.expval(qp.Z(1))

    >>> par = np.array(0.3)
    >>> x = np.array(1.2)
    >>> y = np.array(1.1)
    >>> z = np.array(0.3)
    >>> qnode(par, x, y, z)
    np.float64(-0.3092...)
