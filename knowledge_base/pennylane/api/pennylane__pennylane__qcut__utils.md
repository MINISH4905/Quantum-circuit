---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qcut/utils.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qcut/utils.py
license: Apache-2.0
---

## Module `pennylane/qcut/utils.py`

Support functions for cut_circuit and cut_circuit_mc.

## `find_and_place_cuts`

```python
def find_and_place_cuts(graph, cut_method: Callable=kahypar_cut, cut_strategy: CutStrategy | None=None, replace_wire_cuts=False, local_measurement=False, **kwargs)
```

Automatically finds and places optimal :class:`~.WireCut` nodes into a given tape-converted graph
using a customizable graph partitioning function. Preserves existing placed cuts.

Args:
    graph (MultiDiGraph): The original (tape-converted) graph to be cut.
    cut_method (Callable): A graph partitioning function that takes an input graph and returns
        a list of edges to be cut based on a given set of constraints and objective. Defaults
        to :func:`kahypar_cut` which requires KaHyPar to be installed using
        ``pip install kahypar`` for Linux and Mac users or visiting the
        instructions `here <https://kahypar.org>`__ to compile from
        source for Windows users.
    cut_strategy (CutStrategy): Strategy for optimizing cutting parameters based on device
        constraints. Defaults to ``None`` in which case ``kwargs`` must be fully specified
        for passing to the ``cut_method``.
    replace_wire_cuts (bool): Whether to replace :class:`~.WireCut` nodes with
        :class:`~.MeasureNode` and :class:`~.PrepareNode` pairs. Defaults to ``False``.
    local_measurement (bool): Whether to use the local-measurement circuit-cutting objective,
        i.e. the maximum node-degree of the communication graph, for cut evaluation. Defaults
        to ``False`` which assumes global measurement and uses the total number of cuts as the
        cutting objective.
    kwargs: Additional keyword arguments to be passed to the callable ``cut_method``.

Returns:
    nx.MultiDiGraph: Copy of the input graph with :class:`~.WireCut` nodes inserted.

**Example**

Consider the following 4-wire circuit with a single CNOT gate connecting the top (wires
``[0, 1]``) and bottom (wires ``["a", "b"]``) halves of the circuit. Note there's a
:class:`~.WireCut` manually placed into the circuit already.

.. code-block:: python

    ops = [
        qp.RX(0.1, wires=0),
        qp.RY(0.2, wires=1),
        qp.RX(0.3, wires="a"),
        qp.RY(0.4, wires="b"),
        qp.CNOT(wires=[0, 1]),
        qp.WireCut(wires=1),
        qp.CNOT(wires=["a", "b"]),
        qp.CNOT(wires=[1, "a"]),
        qp.CNOT(wires=[0, 1]),
        qp.CNOT(wires=["a", "b"]),
        qp.RX(0.5, wires="a"),
        qp.RY(0.6, wires="b"),
    ]
    measurements = [qp.expval(qp.X(0) @ qp.Y("a") @ qp.Z("b"))]
    tape = qp.tape.QuantumTape(ops, measurements)

>>> print(qp.drawer.tape_text(tape, decimals=1))
0: ──RX(0.1)─╭●────────╭●──────────┤ ╭<X@Y@Z>
1: ──RY(0.2)─╰X──//─╭●─╰X──────────┤ │
a: ──RX(0.3)─╭●─────╰X─╭●──RX(0.5)─┤ ├<X@Y@Z>
b: ──RY(0.4)─╰X────────╰X──RY(0.6)─┤ ╰<X@Y@Z>

Since the existing :class:`~.WireCut` doesn't sufficiently fragment the circuit, we can find the
remaining cuts using the default KaHyPar partitioner:

>>> graph = qp.qcut.tape_to_graph(tape)
>>> cut_graph = qp.qcut.find_and_place_cuts(
...     graph=graph,
...     num_fragments=2,
...     imbalance=0.5,
... )

Visualizing the newly-placed cut:

>>> print(qp.qcut.graph_to_tape(cut_graph).draw(decimals=1))
0: ──RX(0.1)─╭●────────────╭●───────┤ ╭<X@Y@Z>
1: ──RY(0.2)─╰X──//─╭●──//─╰X───────┤ │
a: ──RX(0.3)─╭●─────╰X─╭●───RX(0.5)─┤ ├<X@Y@Z>
b: ──RY(0.4)─╰X────────╰X───RY(0.6)─┤ ╰<X@Y@Z>

We can then proceed with the usual process of replacing :class:`~.WireCut` nodes with
pairs of :class:`~.MeasureNode` and :class:`~.PrepareNode`, and then break the graph
into fragments. Or, alternatively, we can directly get such processed graph by passing
``replace_wire_cuts=True``:

>>> cut_graph = qp.qcut.find_and_place_cuts(
...     graph=graph,
...     num_fragments=2,
...     imbalance=0.5,
...     replace_wire_cuts=True,
... )
>>> frags, comm_graph = qp.qcut.fragment_graph(cut_graph)
>>> for t in frags:
...     print(qp.qcut.graph_to_tape(t).draw())

.. code-block::

     0: ──RX(0.1)──────╭●───────────────╭●──┤ ⟨X⟩
     1: ──RY(0.2)──────╰X──MeasureNode──│───┤
     2: ──PrepareNode───────────────────╰X──┤

     a: ──RX(0.3)──────╭●──╭X──╭●────────────RX(0.5)──╭┤ ⟨Y ⊗ Z⟩
     b: ──RY(0.4)──────╰X──│───╰X────────────RY(0.6)──╰┤ ⟨Y ⊗ Z⟩
     1: ──PrepareNode──────╰●───MeasureNode────────────┤

Alternatively, if all we want to do is to find the optimal way to fit a circuit onto a smaller
device, a :class:`~.CutStrategy` can be used to populate the necessary explorations of cutting
parameters. As an extreme example, if the only device at our disposal is a 2-qubit device, a
simple cut strategy is to simply specify the the ``max_free_wires`` argument (or equivalently
directly passing a :class:`pennylane.devices.Device` to the ``device`` argument):

>>> cut_strategy = qp.qcut.CutStrategy(max_free_wires=2)
>>> cut_strategy.get_cut_kwargs(graph)
[{'num_fragments': 2, 'imbalance': 0.2857142857142858},
 {'num_fragments': 3, 'imbalance': 0.2857142857142858},
 {'num_fragments': 4, 'imbalance': 0.2857142857142858},
 {'num_fragments': 5, 'imbalance': 0.2857142857142858},
 {'num_fragments': 6, 'imbalance': 0.2857142857142858},
 {'num_fragments': 7, 'imbalance': 0.2857142857142858},
 {'num_fragments': 8, 'imbalance': 0.2857142857142858},
 {'num_fragments': 9, 'imbalance': 0.2857142857142858},
 {'num_fragments': 10, 'imbalance': 0.2857142857142858},
 {'num_fragments': 11, 'imbalance': 0.2857142857142858},
 {'num_fragments': 12, 'imbalance': 0.2857142857142858},
 {'num_fragments': 13, 'imbalance': 0.0},
 {'num_fragments': 14, 'imbalance': 0.0}]

The printed list above shows all the possible cutting configurations one can attempt to perform
in order to search for the optimal cut. This is done by directly passing a
:class:`~.CutStrategy` to :func:`~.find_and_place_cuts`:

>>> cut_graph = qp.qcut.find_and_place_cuts(
        graph=graph,
        cut_strategy=cut_strategy,
    )
>>> print(qp.qcut.graph_to_tape(cut_graph).draw())
0: ──RX──//─╭●──//────────╭●──//────────┤ ╭<X@Y@Z>
1: ──RY──//─╰X──//─╭●──//─╰X────────────┤ │
a: ──RX──//─╭●──//─╰X──//─╭●──//──RX─//─┤ ├<X@Y@Z>
b: ──RY──//─╰X──//────────╰X──//──RY────┤ ╰<X@Y@Z>

As one can tell, quite a few cuts have to be made in order to execute the circuit on solely
2-qubit devices. To verify, let's print the fragments:

>>> qp.qcut.replace_wire_cut_nodes(cut_graph)
>>> frags, comm_graph = qp.qcut.fragment_graph(cut_graph)
>>> for t in frags:
...     print(qp.qcut.graph_to_tape(t).draw())

.. code-block::

     0: ──RX──MeasureNode─┤

     1: ──RY──MeasureNode─┤

     a: ──RX──MeasureNode─┤

     b: ──RY──MeasureNode─┤

     0: ──PrepareNode─╭●──MeasureNode─┤
     1: ──PrepareNode─╰X──MeasureNode─┤

     a: ──PrepareNode─╭●──MeasureNode─┤
     b: ──PrepareNode─╰X──MeasureNode─┤

     1: ──PrepareNode─╭●──MeasureNode─┤
     a: ──PrepareNode─╰X──MeasureNode─┤

     0: ──PrepareNode─╭●──MeasureNode─┤
     1: ──PrepareNode─╰X──────────────┤

     b: ──PrepareNode─╭X──MeasureNode─┤
     a: ──PrepareNode─╰●──MeasureNode─┤

     a: ──PrepareNode──RX──MeasureNode─┤

     b: ──PrepareNode──RY─┤  <Z>

     0: ──PrepareNode─┤  <X>

     a: ──PrepareNode─┤  <Y>

## `replace_wire_cut_node`

```python
def replace_wire_cut_node(node: WireCut, graph)
```

Replace a :class:`~.WireCut` node in the graph with a :class:`~.MeasureNode`
and :class:`~.PrepareNode`.

.. note::

    This function is designed for use as part of the circuit cutting workflow.
    Check out the :func:`qp.cut_circuit() <pennylane.cut_circuit>` transform for more details.

Args:
    node (WireCut): the  :class:`~.WireCut` node to be replaced with a :class:`~.MeasureNode`
        and :class:`~.PrepareNode`
    graph (nx.MultiDiGraph): the graph containing the node to be replaced

**Example**

Consider the following circuit with a manually-placed wire cut:

.. code-block:: python

    wire_cut = qp.WireCut(wires=0)

    ops = [
        qp.RX(0.4, wires=0),
        wire_cut,
        qp.RY(0.5, wires=0),
    ]
    measurements = [qp.expval(qp.Z(0))]
    tape = qp.tape.QuantumTape(ops, measurements)

We can find the circuit graph and remove the wire cut node using:

>>> graph = qp.qcut.tape_to_graph(tape)
>>> qp.qcut.replace_wire_cut_node(wire_cut, graph)

## `replace_wire_cut_nodes`

```python
def replace_wire_cut_nodes(graph)
```

Replace each :class:`~.WireCut` node in the graph with a
:class:`~.MeasureNode` and :class:`~.PrepareNode`.

.. note::

    This function is designed for use as part of the circuit cutting workflow.
    Check out the :func:`qp.cut_circuit() <pennylane.cut_circuit>` transform for more details.

Args:
    graph (nx.MultiDiGraph): The graph containing the :class:`~.WireCut` nodes
        to be replaced

**Example**

Consider the following circuit with manually-placed wire cuts:

.. code-block:: python

    wire_cut_0 = qp.WireCut(wires=0)
    wire_cut_1 = qp.WireCut(wires=1)
    multi_wire_cut = qp.WireCut(wires=[0, 1])

    ops = [
        qp.RX(0.4, wires=0),
        wire_cut_0,
        qp.RY(0.5, wires=0),
        wire_cut_1,
        qp.CNOT(wires=[0, 1]),
        multi_wire_cut,
        qp.RZ(0.6, wires=1),
    ]
    measurements = [qp.expval(qp.Z(0))]
    tape = qp.tape.QuantumTape(ops, measurements)

We can find the circuit graph and remove all the wire cut nodes using:

>>> graph = qp.qcut.tape_to_graph(tape)
>>> qp.qcut.replace_wire_cut_nodes(graph)

## `place_wire_cuts`

```python
def place_wire_cuts(graph, cut_edges: Sequence[tuple[Operation, Operation, Any]])
```

Inserts a :class:`~.WireCut` node for each provided cut edge into a circuit graph.

Args:
    graph (nx.MultiDiGraph): The original (tape-converted) graph to be cut.
    cut_edges (Sequence[Tuple[Operation, Operation, Any]]): List of ``MultiDiGraph`` edges
        to be replaced with a :class:`~.WireCut` node. Each 3-tuple represents the source node, the
        target node, and the wire key of the (multi)edge.

Returns:
    MultiDiGraph: Copy of the input graph with :class:`~.WireCut` nodes inserted.

**Example**

Consider the following 2-wire circuit with one CNOT gate connecting the wires:

.. code-block:: python

    ops = [
        qp.RX(0.432, wires=0),
        qp.RY(0.543, wires="a"),
        qp.CNOT(wires=[0, "a"]),
    ]
    measurements = [qp.expval(qp.Z(0))]
    tape = qp.tape.QuantumTape(ops, measurements)

>>> print(qp.drawer.tape_text(tape, decimals=3))
0: ──RX(0.432)─╭●─┤  <Z>
a: ──RY(0.543)─╰X─┤

If we know we want to place a :class:`~.WireCut` node between the nodes corresponding to the
``RY(0.543, wires=["a"])`` and ``CNOT(wires=[0, 'a'])`` operations after the tape is constructed,
we can first find the edge in the graph:

>>> graph = qp.qcut.tape_to_graph(tape)
>>> op0, op1 = tape.operations[1], tape.operations[2]
>>> cut_edges = [e for e in graph.edges if e[0].obj is op0 and e[1].obj is op1]
>>> cut_edges
[(Wrapped(RY(0.543, wires=['a'])), Wrapped(CNOT(wires=[0, 'a'])), 0)]

Then feed it to this function for placement:

>>> cut_graph = qp.qcut.place_wire_cuts(graph=graph, cut_edges=cut_edges)
>>> cut_graph
<networkx.classes.multidigraph.MultiDiGraph at 0x7f7251ac1220>

And visualize the cut by converting back to a tape:

>>> print(qp.qcut.graph_to_tape(cut_graph).draw(decimals=3))
0: ──RX(0.432)─────╭●─┤  <Z>
a: ──RY(0.543)──//─╰X─┤

## `fragment_graph`

```python
def fragment_graph(graph)
```

Fragments a graph into a collection of subgraphs as well as returning
the communication (`quotient <https://en.wikipedia.org/wiki/Quotient_graph>`__)
graph.

The input ``graph`` is fragmented by disconnecting each :class:`~.MeasureNode` and
:class:`~.PrepareNode` pair and finding the resultant disconnected subgraph fragments.
Each node of the communication graph represents a subgraph fragment and the edges
denote the flow of qubits between fragments due to the removed :class:`~.MeasureNode` and
:class:`~.PrepareNode` pairs.

.. note::

    This operation is designed for use as part of the circuit cutting workflow.
    Check out the :func:`qp.cut_circuit() <pennylane.cut_circuit>` transform for more details.

Args:
    graph (nx.MultiDiGraph): directed multigraph containing measure and prepare
        nodes at cut locations

Returns:
    Tuple[Tuple[nx.MultiDiGraph], nx.MultiDiGraph]: the subgraphs of the cut graph
    and the communication graph.

**Example**

Consider the following circuit with manually-placed wire cuts:

.. code-block:: python

    wire_cut_0 = qp.WireCut(wires=0)
    wire_cut_1 = qp.WireCut(wires=1)
    multi_wire_cut = qp.WireCut(wires=[0, 1])

    ops = [
        qp.RX(0.4, wires=0),
        wire_cut_0,
        qp.RY(0.5, wires=0),
        wire_cut_1,
        qp.CNOT(wires=[0, 1]),
        multi_wire_cut,
        qp.RZ(0.6, wires=1),
    ]
    measurements = [qp.expval(qp.Z(0))]
    tape = qp.tape.QuantumTape(ops, measurements)

We can find the corresponding graph, remove all the wire cut nodes, and
find the subgraphs and communication graph by using:

>>> graph = qp.qcut.tape_to_graph(tape)
>>> qp.qcut.replace_wire_cut_nodes(graph)
>>> qp.qcut.fragment_graph(graph)
([<networkx.classes.multidigraph.MultiDiGraph object at 0x7fb3b2311940>,
  <networkx.classes.multidigraph.MultiDiGraph object at 0x7fb3b2311c10>,
  <networkx.classes.multidigraph.MultiDiGraph object at 0x7fb3b23e2820>,
  <networkx.classes.multidigraph.MultiDiGraph object at 0x7fb3b23e27f0>],
 <networkx.classes.multidigraph.MultiDiGraph object at 0x7fb3b23e26a0>)
