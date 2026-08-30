---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/noise/conditionals.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/noise/conditionals.py
license: Apache-2.0
---

## Module `pennylane/noise/conditionals.py`

Contains utility functions for building boolean conditionals for noise models

Developer note: Conditionals inherit from BooleanFn and store the condition they
utilize in the ``condition`` attribute.

## `WiresIn`

```python
class WiresIn(BooleanFn)
```

A conditional for evaluating if the wires of an operation exist in a specified set of wires.

Args:
    wires (Union[Iterable[int, str], Wires]): Sequence of wires for building the wire set.

.. seealso:: Users are advised to use :func:`~.wires_in` for a functional construction.

## `WiresEq`

```python
class WiresEq(BooleanFn)
```

A conditional for evaluating if a given wire is equal to a specified set of wires.

Args:
    wires (Union[Iterable[int, str], Wires]): Sequence of wires for building the wire set.

.. seealso:: Users are advised to use :func:`~.wires_eq` for a functional construction.

## `wires_in`

```python
def wires_in(wires)
```

Builds a conditional as a :class:`~.BooleanFn` for evaluating
if the wires of an input operation are within the specified set of wires.

Args:
    wires (Union(Iterable[int, str], Wires, Operation, MeasurementProcess, int, str)):
        Object to be used for building the wire set.

Returns:
    :class:`WiresIn <pennylane.noise.conditionals.WiresIn>`: A callable object with
    signature ``Union(Iterable[int, str], Wires, Operation, MeasurementProcess, int, str)``.
    It evaluates to ``True`` if the wire set constructed from the input to the callable is
    a subset of the one built from the specified ``wires`` set.

Raises:
    ValueError: If the wire set cannot be computed from ``wires``.

**Example**

One may use ``wires_in`` with a given sequence of wires which are used as a wire set:

>>> cond_func = qp.noise.wires_in([0, 1])
>>> cond_func(qp.X(0))
True

>>> cond_func(qp.X(3))
False

Additionally, if an :class:`Operation <pennylane.operation.Operation>` is provided,
its ``wires`` are extracted and used to build the wire set:

>>> cond_func = qp.noise.wires_in(qp.CNOT(["alice", "bob"]))
>>> cond_func("alice")
True

>>> cond_func("eve")
False

## `wires_eq`

```python
def wires_eq(wires)
```

Builds a conditional as a :class:`~.BooleanFn` for evaluating
if a given wire is equal to specified set of wires.

Args:
    wires (Union(Iterable[int, str], Wires, Operation, MeasurementProcess, int, str)):
        Object to be used for building the wire set.

Returns:
    :class:`WiresEq <pennylane.noise.conditionals.WiresEq>`: A callable object with
    signature ``Union(Iterable[int, str], Wires, Operation, MeasurementProcess, int, str)``.
    It evaluates to ``True`` if the wire set constructed from the input to the callable
    is equal to the one built from the specified ``wires`` set.

Raises:
    ValueError: If the wire set cannot be computed from ``wires``.

**Example**

One may use ``wires_eq`` with a given sequence of wires which are used as a wire set:

>>> cond_func = qp.noise.wires_eq(0)
>>> cond_func(qp.X(0))
True

>>> cond_func(qp.RY(1.23, wires=[3]))
False

Additionally, if an :class:`Operation <pennylane.operation.Operation>` is provided,
its ``wires`` are extracted and used to build the wire set:

>>> cond_func = qp.noise.wires_eq(qp.RX(1.0, "dino"))
>>> cond_func(qp.RZ(1.23, wires="dino"))
True

>>> cond_func("eve")
False

## `OpIn`

```python
class OpIn(BooleanFn)
```

A conditional for evaluating if a given operation exist in a specified set of operations.

Args:
    ops (Union[str, class, Operation, list[str, class, Operation]]): Sequence of operation
        instances, string representations or classes to build the operation set.

.. seealso:: Users are advised to use :func:`~.op_in` for a functional construction.

## `OpEq`

```python
class OpEq(BooleanFn)
```

A conditional for evaluating if a given operation is equal to the specified operation.

Args:
    ops (Union[str, class, Operation]): An operation instance, string representation or
        class to build the operation set.

.. seealso:: Users are advised to use :func:`~.op_eq` for a functional construction.

## `op_in`

```python
def op_in(ops)
```

Builds a conditional as a :class:`~.BooleanFn` for evaluating
if a given operation exist in a specified set of operations.

Args:
    ops (str, class, Operation, list(Union[str, class, Operation, MeasurementProcess])):
        Sequence of string representations, instances, or classes of the operation(s).

Returns:
    :class:`OpIn <pennylane.noise.conditionals.OpIn>`: A callable object that accepts
    an :class:`~.Operation` or :class:`~.MeasurementProcess` and returns a boolean output.
    For an input from: ``Union[str, class, Operation, list(Union[str, class, Operation])]``
    and evaluates to ``True`` if the input operation(s) exists in the set of operation(s)
    specified by ``ops``. For a ``MeasurementProcess`` input, similar evaluation happens
    on its observable. In both cases, comparison is based on the operation's type,
    irrespective of wires.

**Example**

One may use ``op_in`` with a string representation of the name of the operation:

>>> cond_func = qp.noise.op_in(["RX", "RY"])
>>> cond_func(qp.RX(1.23, wires=[0]))
True

>>> cond_func(qp.RZ(1.23, wires=[3]))
False

>>> cond_func([qp.RX(1.23, wires=[1]), qp.RY(4.56, wires=[2])])
True

Additionally, an instance of :class:`Operation <pennylane.operation.Operation>`
can also be provided:

>>> cond_func = qp.noise.op_in([qp.RX(1.0, "dino"), qp.RY(2.0, "rhino")])
>>> cond_func(qp.RX(1.23, wires=["eve"]))
True

>>> cond_func(qp.RY(1.23, wires=["dino"]))
True

>>> cond_func([qp.RX(1.23, wires=[1]), qp.RZ(4.56, wires=[2])])
False

## `op_eq`

```python
def op_eq(ops)
```

Builds a conditional as a :class:`~.BooleanFn` for evaluating
if a given operation is equal to the specified operation.

Args:
    ops (str, class, Operation, MeasurementProcess): String representation, an instance
        or class of the operation, or a measurement process.

Returns:
    :class:`OpEq <pennylane.noise.conditionals.OpEq>`: A callable object that accepts
    an :class:`~.Operation` or :class:`~.MeasurementProcess` and returns a boolean output.
    For an input from: ``Union[str, class, Operation]`` it evaluates to ``True``
    if the input operations are equal to the operations specified by ``ops``.
    For a ``MeasurementProcess`` input, similar evaluation happens on its observable. In
    both cases, the comparison is based on the operation's type, irrespective of wires.

**Example**

One may use ``op_eq`` with a string representation of the name of the operation:

>>> cond_func = qp.noise.op_eq("RX")
>>> cond_func(qp.RX(1.23, wires=[0]))
True

>>> cond_func(qp.RZ(1.23, wires=[3]))
False

>>> cond_func("CNOT")
False

Additionally, an instance of :class:`Operation <pennylane.operation.Operation>`
can also be provided:

>>> cond_func = qp.noise.op_eq(qp.RX(1.0, "dino"))
>>> cond_func(qp.RX(1.23, wires=["eve"]))
True

>>> cond_func(qp.RY(1.23, wires=["dino"]))
False

## `MeasEq`

```python
class MeasEq(BooleanFn)
```

A conditional for evaluating if a given measurement process is of the same type
as the specified measurement process.

Args:
    mp(Union[Iterable[MeasurementProcess], MeasurementProcess, Callable]): A measurement
        process instance or a measurement function to build the measurement set.

.. seealso:: Users are advised to use :func:`~.meas_eq` for a functional construction.

## `meas_eq`

```python
def meas_eq(mps)
```

Builds a conditional as a :class:`~.BooleanFn` for evaluating if a given
measurement process is of the same type as the specified measurement process.

Args:
    mps (MeasurementProcess, Callable): An instance(s) of any class that inherits from
        :class:`~.MeasurementProcess` or a :mod:`measurement <pennylane.measurements>` function(s).

Returns:
    :class:`MeasEq <pennylane.noise.conditionals.MeasEq>`: A callable object that accepts
    an instance of :class:`~.MeasurementProcess` and returns a boolean output. It accepts
    any input from: ``Union[class, function, list(Union[class, function, MeasurementProcess])]``
    and evaluates to ``True`` if the input measurement process(es) is equal to the
    measurement process(es) specified by ``ops``. Comparison is based on the measurement's
    return type, irrespective of wires, observables or any other relevant attribute.

**Example**

One may use ``meas_eq`` with an instance of
:class:`MeasurementProcess <pennylane.measurements.MeasurementProcess>`:

>>> cond_func = qp.noise.meas_eq(qp.expval(qp.Y(0)))
>>> cond_func(qp.expval(qp.Z(9)))
True

>>> cond_func(qp.sample(op=qp.Y(0)))
False

Additionally, a :mod:`measurement <pennylane.measurements>` function
can also be provided:

>>> cond_func = qp.noise.meas_eq(qp.expval)
>>> cond_func(qp.expval(qp.X(0)))
True

>>> cond_func(qp.probs(wires=[0, 1]))
False

>>> cond_func(qp.counts(qp.Z(0)))
False

## `partial_wires`

```python
def partial_wires(operation, *args, **kwargs)
```

Builds a partial function based on the given gate operation or measurement process
with all argument frozen except ``wires``.

Args:
    operation (Operation | MeasurementProcess | class | Callable): Instance of an
        operation or the class (callable) corresponding to the operation (measurement).
    *args: Positional arguments provided in the case where the keyword argument
        ``operation`` is a class for building the partially evaluated instance.
    **kwargs: Keyword arguments for the building the partially evaluated instance.
        These will override any arguments present in the operation instance or ``args``.

Returns:
    Callable: A wrapper function that accepts a sequence of wires as an argument or
    any object with a ``wires`` property.

Raises:
    ValueError: If ``args`` are provided when the given ``operation`` is an instance.

**Example**

One may give an instance of :class:`Operation <pennylane.operation.Operation>`
for the ``operation`` argument:

>>> func = qp.noise.partial_wires(qp.RX(1.2, [12]))
>>> func(2)
RX(1.2, wires=[2])
>>> func(qp.RY(1.0, ["wires"]))
RX(1.2, wires=['wires'])

Additionally, an :class:`Operation <pennylane.operation.Operation>` class can
also be provided, while providing required positional arguments via ``args``:

>>> func = qp.noise.partial_wires(qp.RX, 3.2, [20])
>>> func(qp.RY(1.0, [0]))
RX(3.2, wires=[0])

Moreover, one can use ``kwargs`` instead of positional arguments:

>>> func = qp.noise.partial_wires(qp.RX, phi=1.2)
>>> func(qp.RY(1.0, [2]))
RX(1.2, wires=[2])
>>> rfunc = qp.noise.partial_wires(qp.RX(1.2, [12]), phi=2.3)
>>> rfunc(qp.RY(1.0, ["light"]))
RX(2.3, wires=['light'])

Finally, one may also use this with an instance of
:class:`MeasurementProcess <pennylane.measurement.MeasurementProcess>`

>>> func = qp.noise.partial_wires(qp.expval(qp.Z(0)))
>>> func(qp.RX(1.2, wires=[9]))
expval(Z(9))
