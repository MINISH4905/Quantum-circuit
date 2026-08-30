---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/queuing.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/queuing.py
license: Apache-2.0
---

## Module `pennylane/queuing.py`

This module contains the classes for placing objects into queues.

Description
-----------

Users provide *quantum functions* which PennyLane needs to convert into a circuit representation capable
of being executed by a device. A quantum function is any callable that:

* accepts classical inputs
* constructs any number of quantum :class:`~.Operator` objects
* returns one or more :class:`~.MeasurementProcess` objects.

For example:

.. code-block:: python

    def qfunc(x, scale_value=1):
        qp.RX(x * scale_value, wires=0)
        if (1 != 2):
            qp.S(0)
        return qp.expval(qp.Z(0)), qp.expval(qp.X(1))

To convert from a quantum function to a representation of a circuit, we use queuing.

A *queuable object* is anything that can be placed into a queue. These will be :class:`~.Operator`,
:class:`~.MeasurementProcess`, and :class:`~.QuantumTape` objects. :class:`~.Operator` and
:class:`~.MeasurementProcess` objects achieve queuing via a :meth:`~.Operator.queue` method called upon construction.
Note that even though :class:`~.QuantumTape` is a queuable object, it does not have a ``queue`` method.

When an object is queued, it sends itself to the :class:`~.QueuingManager`. The :class:`~.QueuingManager`
is a global singleton class that facilitates placing objects in the queue. All of :class:`~.QueuingManager`'s methods
and properties are class methods and properties, so all instances will access the same information.

The :meth:`~.QueuingManager.active_context` is the queue where any new objects are placed.
The :class:`~.QueuingManager` is said to be *recording* if an active context exists.

Active contexts are :class:`~.AnnotatedQueue` instances. They are *context managers* where recording occurs
within a ``with`` block.

Let's take a look at an example. If we query the :class:`~.QueuingManager` outside of an
:class:`~.AnnotatedQueue`'s context, we can see that nothing is recording and no active context exists.

>>> print("Are we recording? ", qp.QueuingManager.recording())
Are we recording?  False
>>> print("What's the active context? ", qp.QueuingManager.active_context())
What's the active context?  None

Inside of a context, we can see the active recording context:

>>> with qp.queuing.AnnotatedQueue() as q:
...     print("Are we recording? ", qp.QueuingManager.recording())
...     print("Is q the active queue? ", q is qp.QueuingManager.active_context())
Are we recording?  True
Is q the active queue?  True

If we have nested :class:`~.AnnotatedQueue` contexts, only the innermost one will be recording.
Once the currently active queue exits, any outer queue will resume recording.

>>> with qp.queuing.AnnotatedQueue() as q1:
...     print("Is q1 recording? ", q1 is qp.QueuingManager.active_context())
...     with qp.queuing.AnnotatedQueue() as q2:
...         print("Is q1 recording? ", q1 is qp.QueuingManager.active_context())
...     print("Is q1 recording? ", q1 is qp.QueuingManager.active_context())
Is q1 recording?  True
Is q1 recording?  False
Is q1 recording?  True

If we construct an operator inside the recording context, we can see it is added to the queue:

>>> with qp.queuing.AnnotatedQueue() as q:
...     op = qp.X(0)
>>> q.queue
[X(0)]

If an operator is constructed outside of the context, we can manually add it to the queue by
calling the :meth:`~.Operator.queue` method. The :meth:`~.Operator.queue` method is automatically
called upon initialization, but it can also be manually called at a later time.

>>> op = qp.X(0)

.. code-block:: python

    with qp.queuing.AnnotatedQueue() as q:
        op.queue()

>>> q.queue
[X(0)]

An object can only exist up to *once* in the queue, so calling queue multiple times will
not do anything.

>>> op = qp.X(0)

.. code-block:: python

    with qp.queuing.AnnotatedQueue() as q:
        op.queue()
        op.queue()

>>> q.queue
[X(0)]

The :func:`~.apply` method allows a single object to be queued multiple times in a circuit.
The function queues a copy of the original object if it already in the queue.

>>> op = qp.X(0)

.. code-block:: python

    with qp.queuing.AnnotatedQueue() as q:
        qp.apply(op)
        qp.apply(op)

>>> q.queue
[X(0), X(0)]
>>> q.queue[0] is q.queue[1]
False

In the case of operators composed of other operators, like with :class:`~.SymbolicOp` and
:class:`~.CompositeOp`, the new nested operation removes its constituents from the queue.
Only the operators that will end up in the circuit will remain.

>>> with qp.queuing.AnnotatedQueue() as q:
...     base = qp.X(0)
...     print(q.queue)
...     pow_op = base ** 1.5
...     print(q.queue)
[X(0)]
[X(0)**1.5]

Once the queue is constructed, the :func:`~.process_queue` function converts it into the operations
and measurements in the final circuit. This step eliminates any object that has an owner.

.. code-block:: python

    with qp.queuing.AnnotatedQueue() as q:
        qp.StatePrep(np.array([1.0, 0]), wires=0)
        base = qp.X(0)
        pow_op = base ** 1.5
        qp.expval(qp.Z(0) @ qp.X(1))

>>> ops, measurements = qp.queuing.process_queue(q)
>>> ops
[StatePrep(array([1., 0.]), wires=[0]), X(0)**1.5]
>>> measurements
[expval(Z(0) @ X(1))]

These lists can be used to construct a :class:`~.QuantumScript`:

>>> qp.tape.QuantumScript(ops, measurements)
<QuantumScript: wires=[0, 1], params=1>

In order to construct new operators within a recording, but without queuing them
use the :meth:`~.queuing.QueuingManager.stop_recording` context upon construction:

.. code-block:: python

    with qp.queuing.AnnotatedQueue() as q:
        with qp.QueuingManager.stop_recording():
            qp.Y(1)

>>> q.queue
[]

## `WrappedObj`

```python
class WrappedObj
```

Wraps an object to make its hash dependent on its identity

## `QueuingManager`

```python
class QueuingManager
```

Singleton global entry point for managing active recording contexts.

This class consists purely of class methods. It both maintains a list of
recording queues and allows communication with the currently active object.

Queueable objects, like :class:`~.operation.Operator` and :class:`~.measurements.MeasurementProcess`, should
use ``QueuingManager`` as an entry point for accessing the active queue.

See also: :class:`~.AnnotatedQueue`, :class:`~.tape.QuantumTape`, :meth:`~.operation.Operator.queue`.

Recording queues, such as :class:`~.AnnotatedQueue`, must define the following methods:

* ``append``: define an action to perform when an object append
  request is made.

* ``remove``: define an action to perform when an object removal request is made.

* ``get_info``: retrieve the object's metadata

* ``update_info``: Update an object's metadata if it is already queued.

To start and end recording, the recording queue can use the :meth:`add_active_queue` and
:meth:`remove_active_queue` methods.

### `add_active_queue`

```python
def add_active_queue(cls, queue)
```

Makes a queue the currently active recording context.

### `remove_active_queue`

```python
def remove_active_queue(cls)
```

Ends recording on the currently active recording queue.

### `recording`

```python
def recording(cls)
```

Whether a queuing context is active and recording operations

### `active_context`

```python
def active_context(cls) -> Optional['AnnotatedQueue']
```

Returns the currently active queuing context.

### `stop_recording`

```python
def stop_recording(cls)
```

A context manager and decorator to ensure that contained logic is non-recordable
or non-queueable within a QNode or quantum tape context.

**Example:**

Consider the function:

>>> def list_of_ops(params, wires):
...     return [
...         qp.RX(params[0], wires=wires),
...         qp.RY(params[1], wires=wires),
...         qp.RZ(params[2], wires=wires)
...     ]

If executed in a recording context, the operations constructed in the function will be queued:

>>> dev = qp.device("default.qubit", wires=2)
>>> @qp.qnode(dev)
... def circuit(params):
...     ops = list_of_ops(params, wires=0)
...     qp.apply(ops[-1])  # apply the last operation from the list again
...     return qp.expval(qp.Z(0))
>>> print(qp.draw(circuit)([1, 2, 3]))
0: ──RX(1.00)──RY(2.00)──RZ(3.00)──RZ(3.00)─┤  <Z>

Using the ``stop_recording`` context manager, all logic contained inside is not queued or recorded.

>>> @qp.qnode(dev)
... def circuit(params):
...     with qp.QueuingManager.stop_recording():
...         ops = list_of_ops(params, wires=0)
...     qp.apply(ops[-1])
...     return qp.expval(qp.Z(0))
>>> print(qp.draw(circuit)([1, 2, 3]))
0: ──RZ(3.00)─┤  <Z>

The context manager can also be used as a decorator on a function:

>>> @qp.QueuingManager.stop_recording()
... def list_of_ops(params, wires):
...     return [
...         qp.RX(params[0], wires=wires),
...         qp.RY(params[1], wires=wires),
...         qp.RZ(params[2], wires=wires)
...     ]
>>> @qp.qnode(dev)
... def circuit(params):
...     ops = list_of_ops(params, wires=0)
...     qp.apply(ops[-1])
...     return qp.expval(qp.Z(0))
>>> print(qp.draw(circuit)([1, 2, 3]))
0: ──RZ(3.00)─┤  <Z>

### `append`

```python
def append(cls, obj, **kwargs)
```

Append an object to the queue(s).

Args:
    obj: the object to be appended

### `remove`

```python
def remove(cls, obj)
```

Remove an object from the queue(s) if it is in the queue(s).

Args:
    obj: the object to be removed

### `update_info`

```python
def update_info(cls, obj, **kwargs)
```

Updates information of an object in the active queue if it is already in the queue.

Args:
    obj: the object with metadata to be updated

### `get_info`

```python
def get_info(cls, obj)
```

Retrieves information of an object in the active queue.

Args:
    obj: the object with metadata to be retrieved

Returns:
    object metadata

## `AnnotatedQueue`

```python
class AnnotatedQueue(OrderedDict)
```

Lightweight class that maintains a basic queue of operations, in addition
to metadata annotations.

### `__enter__`

```python
def __enter__(self)
```

Adds this instance to the global list of active contexts.

Returns:
    AnnotatedQueue: this instance

### `__exit__`

```python
def __exit__(self, exception_type, exception_value, traceback)
```

Remove this instance from the global list of active contexts.

### `append`

```python
def append(self, obj, **kwargs)
```

Append ``obj`` into the queue with ``kwargs`` metadata.

### `remove`

```python
def remove(self, obj)
```

Remove ``obj`` from the queue. Passes silently if the object is not in the queue.

### `update_info`

```python
def update_info(self, obj, **kwargs)
```

Update ``obj``'s metadata with ``kwargs`` if it exists in the queue.

### `get_info`

```python
def get_info(self, obj)
```

Retrieve the metadata for ``obj``.  Raises a ``QueuingError`` if obj is not in the queue.

### `queue`

```python
def queue(self)
```

Returns a list of objects in the annotated queue

## `apply`

```python
def apply(op, context: type[QueuingManager] | AnnotatedQueue=QueuingManager)
```

Apply an instantiated operator or measurement to a queuing context.

Args:
    op (.Operator or .MeasurementProcess): the operator or measurement to apply/queue
    context (type[.QueuingManager] | AnnotatedQueue): The queuing context to queue the operator to.
        Note that if no context is specified, the operator is
        applied to the currently active queuing context.
Returns:
    .Operator or .MeasurementProcess: the input operator is returned for convenience

**Example**

In PennyLane, operations and measurements are 'queued' or added to a circuit
when they are instantiated.

The ``apply`` function can be used to add operations that might have
already been instantiated elsewhere to the QNode:

.. code-block:: python

    op = qp.RX(0.4, wires=0)
    dev = qp.device("default.qubit", wires=2)

    @qp.qnode(dev)
    def circuit(x):
        qp.RY(x, wires=0)  # applied during instantiation
        qp.apply(op)  # manually applied
        return qp.expval(qp.Z(0))

>>> print(qp.draw(circuit)(0.6))
0: ──RY(0.60)──RX(0.40)─┤  <Z>

It can also be used to apply functions repeatedly:

.. code-block:: python

    @qp.qnode(dev)
    def circuit(x):
        qp.apply(op)
        qp.RY(x, wires=0)
        qp.apply(op)
        return qp.expval(qp.Z(0))

>>> print(qp.draw(circuit)(0.6))
0: ──RX(0.40)──RY(0.60)──RX(0.40)─┤  <Z>

.. warning::

    If you use ``apply`` on an operator that has already been queued, it will
    be queued for a second time. For example:

    .. code-block:: python

        @qp.qnode(dev)
        def circuit():
            op = qp.Hadamard(0)
            qp.apply(op)
            return qp.expval(qp.Z(0))

    >>> print(qp.draw(circuit)())
    0: ──H──H─┤  <Z>

.. details::
    :title: Usage Details

    Instantiated measurements can also be applied to queuing contexts
    using ``apply``:

    .. code-block:: python

        meas = qp.expval(qp.Z(0) @ qp.Y(1))
        dev = qp.device("default.qubit", wires=2)

        @qp.qnode(dev)
        def circuit(x):
            qp.RY(x, wires=0)
            qp.CNOT(wires=[0, 1])
            return qp.apply(meas)

    >>> print(qp.draw(circuit)(0.6))
    0: ──RY(0.60)─╭●─┤ ╭<Z@Y>
    1: ───────────╰X─┤ ╰<Z@Y>

    By default, ``apply`` will queue operators to the currently
    active queuing context.

## `process_queue`

```python
def process_queue(queue: AnnotatedQueue) -> tuple[list[ops_or_meas], list['pennylane.measurements.MeasurementProcess']]
```

Process the annotated queue, creating a list of quantum
operations and measurement processes.

Args:
    queue (.AnnotatedQueue): The queue to be processed into individual lists

Returns:
    tuple[list(.Operation), list(.MeasurementProcess)]:
    The list of tape operations, the list of tape measurements

Raises:
    QueuingError: If the queue contains objects that cannot be processed into a QuantumScript
