---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/tape/tape.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/tape/tape.py
license: Apache-2.0
---

## Module `pennylane/tape/tape.py`

This module contains the base quantum tape.

## `rotations_and_diagonal_measurements`

```python
def rotations_and_diagonal_measurements(tape)
```

Compute the rotations for overlapping observables, and return them along with the diagonalized observables.

## `QuantumTape`

```python
class QuantumTape(QuantumScript, AnnotatedQueue)
```

A quantum tape recorder, that records and stores variational quantum programs.

Args:
    ops (Iterable[Operator]): An iterable of the operations to be performed
    measurements (Iterable[MeasurementProcess]): All the measurements to be performed
    prep (Iterable[Operator]): Arguments to specify state preparations to
        perform at the start of the circuit. These should go at the beginning of ``ops``
        instead.

Keyword Args:
    shots (None, int, Sequence[int], ~.Shots): Number and/or batches of shots for execution.
        Note that this property is still experimental and under development.
    trainable_params (None, Sequence[int]): the indices for which parameters are trainable

.. note::
    If performance and memory usage is a concern, and the queueing capabilities of this class are not
    crucial to your use case, we recommend using the :class:`~.QuantumScript` class instead,
    which is a drop-in replacement with a similar interface.
    For more information, check :ref:`tape-vs-script`.

**Example**

Tapes can be constructed by directly providing operations and measurements:

>>> ops = [qp.BasisState([1, 0], wires=[0, 1]), qp.S(0), qp.T(1)]
>>> measurements = [qp.state()]
>>> tape = qp.tape.QuantumTape(ops, measurements)
>>> tape.circuit
[BasisState(array([1, 0]), wires=[0, 1]), S(0), T(1), state(wires=[])]

They can also be populated into a recording tape via queuing.

.. code-block:: python

    with qp.tape.QuantumTape() as tape:
        qp.RX(0.432, wires=0)
        qp.RY(0.543, wires=0)
        qp.CNOT(wires=[0, 'a'])
        qp.RX(0.133, wires='a')
        qp.expval(qp.Z(0))

A ``QuantumTape`` can also be constructed directly from an :class:`~.AnnotatedQueue`:

.. code-block:: python

    with qp.queuing.AnnotatedQueue() as q:
        qp.RX(0.432, wires=0)
        qp.RY(0.543, wires=0)
        qp.CNOT(wires=[0, 'a'])
        qp.RX(0.133, wires='a')
        qp.expval(qp.Z(0))

    tape = qp.tape.QuantumTape.from_queue(q)

Once constructed, the tape may act as a quantum circuit and information
about the quantum circuit can be queried:

>>> list(tape)
[RX(0.432, wires=[0]), RY(0.543, wires=[0]), CNOT(wires=[0, 'a']), RX(0.133, wires=['a']), expval(Z(0))]
>>> tape.operations
[RX(0.432, wires=[0]), RY(0.543, wires=[0]), CNOT(wires=[0, 'a']), RX(0.133, wires=['a'])]
>>> tape.observables
[Z(0)]
>>> tape.get_parameters()
[0.432, 0.543, 0.133]
>>> tape.wires
Wires([0, 'a'])
>>> tape.num_params
3

The existing circuit is overridden upon exiting a recording context.

Iterating over the quantum circuit can be done by iterating over the tape
object:

>>> for op in tape:
...     print(op)
RX(0.432, wires=[0])
RY(0.543, wires=[0])
CNOT(wires=[0, 'a'])
RX(0.133, wires=['a'])
expval(Z(0))

Tapes can also as sequences and support indexing and the ``len`` function:

>>> tape[0]
RX(0.432, wires=[0])
>>> len(tape)
5

The :class:`~.CircuitGraph` can also be accessed:

>>> tape.graph
<pennylane.circuit_graph.CircuitGraph object at 0x...>

Once constructed, the quantum tape can be executed directly on a supported
device via the :func:`~.pennylane.execute` function:

>>> dev = qp.device("default.qubit", wires=[0, 'a'])
>>> qp.execute([tape], dev, diff_method=None)
(np.float64(0.7775069381227451),)

A new tape can be created by passing new parameters along with the indices
to be updated to :meth:`~pennylane.tape.QuantumScript.bind_new_parameters`:

>>> new_tape = tape.bind_new_parameters(params=[0.56], indices=[0])
>>> tape.get_parameters()
[0.432, 0.543, 0.133]
>>> new_tape.get_parameters()
[0.56, 0.543, 0.133]


To prevent the tape from being queued use :meth:`~.queuing.QueuingManager.stop_recording`.

.. code-block:: python

    with qp.tape.QuantumTape() as tape1:
        with qp.QueuingManager.stop_recording():
            with qp.tape.QuantumTape() as tape2:
                qp.RX(0.123, wires=0)

Here, tape2 records the RX gate, but tape1 doesn't record tape2.

>>> tape1.operations
[]
>>> tape2.operations
[RX(0.123, wires=[0])]

This is useful for when you want to transform a tape first before applying it.

### `__getitem__`

```python
def __getitem__(self, key)
```

Overrides the default because QuantumTape is both a QuantumScript and an AnnotatedQueue.
If key is an int, the caller is likely indexing the backing QuantumScript. Otherwise, the
caller is likely indexing the backing AnnotatedQueue.
