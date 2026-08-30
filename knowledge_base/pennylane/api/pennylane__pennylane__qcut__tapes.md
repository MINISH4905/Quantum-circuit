---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qcut/tapes.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qcut/tapes.py
license: Apache-2.0
---

## Module `pennylane/qcut/tapes.py`

Functions handling quantum tapes for circuit cutting, and their auxillary functions.

## `tape_to_graph`

```python
def tape_to_graph(tape: QuantumScript)
```

Converts a quantum tape to a directed multigraph.

.. note::

    This operation is designed for use as part of the circuit cutting workflow.
    Check out the :func:`qp.cut_circuit() <pennylane.cut_circuit>` transform for more details.

Args:
    tape (QuantumTape): tape to be converted into a directed multigraph

Returns:
    nx.MultiDiGraph: a directed multigraph that captures the circuit structure
    of the input tape. The nodes of the graph are formatted as ``WrappedObj(op)``, where
    ``WrappedObj.obj`` is the operator.

**Example**

Consider the following tape:

.. code-block:: python

    ops = [
        qp.RX(0.4, wires=0),
        qp.RY(0.9, wires=0),
        qp.CNOT(wires=[0, 1]),
    ]
    measurements = [qp.expval(qp.Z(1))]
    tape = qp.tape.QuantumTape(ops,)

Its corresponding circuit graph can be found using

>>> qp.qcut.tape_to_graph(tape)
<networkx.classes.multidigraph.MultiDiGraph at 0x7fe41cbd7210>

## `graph_to_tape`

```python
def graph_to_tape(graph) -> QuantumScript
```

Converts a directed multigraph to the corresponding :class:`~.QuantumTape`.

To account for the possibility of needing to perform mid-circuit measurements, if any operations
follow a :class:`MeasureNode` operation on a given wire then these operations are mapped to a
new wire.

.. note::

    This function is designed for use as part of the circuit cutting workflow.
    Check out the :func:`qp.cut_circuit() <pennylane.cut_circuit>` transform for more details.

Args:
    graph (nx.MultiDiGraph): directed multigraph to be converted to a tape

Returns:
    QuantumTape: the quantum tape corresponding to the input graph

**Example**

Consider the following circuit:

.. code-block:: python

    ops = [
        qp.RX(0.4, wires=0),
        qp.RY(0.5, wires=1),
        qp.CNOT(wires=[0, 1]),
        qp.qcut.MeasureNode(wires=1),
        qp.qcut.PrepareNode(wires=1),
        qp.CNOT(wires=[1, 0]),
    ]
    measurements = [qp.expval(qp.Z(0))]
    tape = qp.tape.QuantumTape(ops, measurements)

This circuit contains operations that follow a :class:`~.MeasureNode`. These operations will
subsequently act on wire ``2`` instead of wire ``1``:

>>> graph = qp.qcut.tape_to_graph(tape)
>>> tape = qp.qcut.graph_to_tape(graph)
>>> print(tape.draw())
0: ──RX──────────╭●──────────────╭X─┤  <Z>
1: ──RY──────────╰X──MeasureNode─│──┤
2: ──PrepareNode─────────────────╰●─┤

## `expand_fragment_tape`

```python
def expand_fragment_tape(tape: QuantumScript) -> tuple[list[QuantumScript], list[PrepareNode], list[MeasureNode]]
```

Expands a fragment tape into a sequence of tapes for each configuration of the contained
:class:`MeasureNode` and :class:`PrepareNode` operations.

.. note::

    This function is designed for use as part of the circuit cutting workflow.
    Check out the :func:`qp.cut_circuit() <pennylane.cut_circuit>` transform for more details.

Args:
    tape (QuantumTape): the fragment tape containing :class:`MeasureNode` and
        :class:`PrepareNode` operations to be expanded

Returns:
    Tuple[List[QuantumTape], List[PrepareNode], List[MeasureNode]]: the
    tapes corresponding to each configuration and the order of preparation nodes and
    measurement nodes used in the expansion

**Example**

Consider the following circuit, which contains a :class:`~.MeasureNode` and
:class:`~.PrepareNode` operation:

.. code-block:: python

    ops = [
        qp.qcut.PrepareNode(wires=0),
        qp.RX(0.5, wires=0),
        qp.qcut.MeasureNode(wires=0),
    ]
    tape = qp.tape.QuantumTape(ops)

We can expand over the measurement and preparation nodes using:

>>> tapes, prep, meas = qp.qcut.expand_fragment_tape(tape)
>>> for t in tapes:
...     print(qp.drawer.tape_text(t, decimals=1))
0: ──I──RX(0.5)─┤  <I>  <Z>
0: ──I──RX(0.5)─┤  <X>
0: ──I──RX(0.5)─┤  <Y>
0: ──X──RX(0.5)─┤  <I>  <Z>
0: ──X──RX(0.5)─┤  <X>
0: ──X──RX(0.5)─┤  <Y>
0: ──H──RX(0.5)─┤  <I>  <Z>
0: ──H──RX(0.5)─┤  <X>
0: ──H──RX(0.5)─┤  <Y>
0: ──H──S──RX(0.5)─┤  <I>  <Z>
0: ──H──S──RX(0.5)─┤  <X>
0: ──H──S──RX(0.5)─┤  <Y>
