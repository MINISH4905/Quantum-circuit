---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ftqc/graph_state_preparation.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ftqc/graph_state_preparation.py
license: Apache-2.0
---

## Module `pennylane/ftqc/graph_state_preparation.py`

This module contains the GraphStatePrep template.

## `make_graph_state`

```python
def make_graph_state(graph, wires, one_qubit_ops=qp.H, two_qubit_ops=qp.CZ)
```

A program-capture compatible way to create a GraphStatePrep template.
We can't capture the graph object in plxpr, so instead, if capture is enabled,
we capture the operations generated in computing the decomposition.

## `GraphStatePrep`

```python
class GraphStatePrep(Operation)
```

Encode a graph state with a single graph operation applied on each qubit, and an entangling
operation applied on nearest-neighbor qubits defined by the graph connectivity.
The initial graph is :math:`|0\rangle^{\otimes V}`, given each qubit or graph vertex node
(:math:`V`) in the graph is in the :math:`|0\rangle` state and is not entangled with any
other qubit.
The target graph state :math:`| \psi \rangle` is:
:math:`| \psi \rangle = \prod\limits_{\{a, b\} \in E} U_{ab}|+\rangle^{\otimes V}`
where :math:`U_{ab}` is a phase gate applied to the vertices :math:`a`, :math:`b` of a edge
:math:`E` in the graph as illustrated in eq. (24)
in `arxiv:quant-ph/0602096 <https://arxiv.org/pdf/quant-ph/0602096>`_.

The target graph state can be prepared as below:

    1. Each qubit is prepared as :math:`|+\rangle^{\otimes V}` state by applying the
    ``one_qubit_ops`` (:class:`~.pennylane.H` gate) operation.

    2. Entangle every nearest qubit pair in the graph with ``two_qubit_ops``
    (:class:`~.pennylane.CZ` gate) operation.

Args:
    graph (Union[QubitGraph, networkx.Graph]): QubitGraph or networkx.Graph object mapping qubit
        to wires. The node labels of ``graph`` must be sortable.
    one_qubit_ops (Operation): Operator to prepare the initial state of each qubit. Defaults to
        :class:`~.pennylane.Hadamard`.
    two_qubit_ops (Operation): Operator to entangle nearest qubits. Defaults to
        :class:`~.pennylane.CZ`.
    wires (Optional[Wires]): Wires the operator applies on. Wires are be mapped 1:1 to the graph
        nodes sorted in ascending order. Optional only `graph` is a QubitGraph. If no wires are
        provided, the ``children`` of the provided ``QubitGraph`` will be used as wires.

.. todo::

    1. To define more complex starting states not relying on a single ops (``one_qubit_ops``
        and ``two_qubit_ops``).
    2. Ensure ``wires`` works with multiple dimensional ``nx.Graph()`` object after the wires
       indexing scheme is added to the ``ftqc`` module.

**Example:**
    The graph state preparation layer can be customized by the user.

    .. code-block:: python

        from pennylane.ftqc import generate_lattice, GraphStatePrep, QubitGraph

        dev = qp.device('default.qubit')

        @qp.qnode(dev)
        def circuit(q, one_qubit_ops, two_qubit_ops, wires = None):
            GraphStatePrep(graph=q, one_qubit_ops=one_qubit_ops, two_qubit_ops=two_qubit_ops, wires = wires)
            return qp.probs()

        lattice = generate_lattice([2, 2], "square")
        q = QubitGraph(lattice.graph, id="square")

        one_qubit_ops = qp.Y
        two_qubit_ops = qp.CNOT

    If the wires argument is not explicitly passed to the circuit, the child nodes of the
    ``QubitGraph`` are used as the wires. The resulting circuit after applying the
    ``GraphStatePrep`` template is:

    >>> print(qp.draw(circuit, level="device")(q, one_qubit_ops, two_qubit_ops))
    QubitGraph<id=(0, 0), loc=[square]>: ──Y─╭●─╭●───────┤  Probs
    QubitGraph<id=(0, 1), loc=[square]>: ──Y─│──╰X─╭●────┤  Probs
    QubitGraph<id=(1, 0), loc=[square]>: ──Y─╰X────│──╭●─┤  Probs
    QubitGraph<id=(1, 1), loc=[square]>: ──Y───────╰X─╰X─┤  Probs

    The circuit wires can also be customized by passing a wires argument to the circuit as follows:

    >>> print(qp.draw(circuit, level="device")(q, one_qubit_ops, two_qubit_ops, wires=[0, 1, 2, 3]))
    0: ──Y─╭●─╭●───────┤  Probs
    1: ──Y─│──╰X─╭●────┤  Probs
    2: ──Y─╰X────│──╭●─┤  Probs
    3: ──Y───────╰X─╰X─┤  Probs

.. details::
    :title: A Note on Node Ordering

    The graph structures used for defining qubit connectivity are inherently *unordered* data
    structures. Mapping the nodes in the graph to the *ordered* sequence of wires can therefore
    result in ambiguity. To ensure this mapping is reliable and deterministic, the sequence of
    wires is mapped to the list of graph nodes sorted in ascending order.

    Consider the following example:

    .. code-block:: python

        import networkx as nx
        from pennylane.ftqc import GraphStatePrep

        dev = qp.device("default.qubit")

        @qp.qnode(dev)
        def circuit(graph, wires):
            GraphStatePrep(graph=graph, one_qubit_ops=qp.H, two_qubit_ops=qp.CZ, wires=wires)
            return qp.state()

    Defining a graph structure and drawing the circuit shows how the graph node labels have been
    mapped to wires:

    >>> g1 = nx.Graph([("a", "b"), ("b", "c"), ("c", "d")])  # (a) -- (b) -- (c) -- (d)
    >>> print(qp.draw(circuit, level="device")(g1, wires=range(4)))
    0: ──H─╭●───────┤  State
    1: ──H─╰Z─╭●────┤  State
    2: ──H────╰Z─╭●─┤  State
    3: ──H───────╰Z─┤  State

    In other words, ``GraphStatePrep`` has defined the node-label-to-wire mapping::

        {"a": 0, "b": 1, "c": 2, "d": 3}

    which corresponds to the graph structure with wire indices::

        (0) -- (1) -- (2) -- (3)

    as shown in the circuit diagram with ``CZ`` operations applied along each edge in the graph.

    Drawing the circuit for a graph with the same structure but with different node labels
    gives:

    >>> g2 = nx.Graph([("b", "a"), ("a", "c"), ("c", "d")])  # (b) -- (a) -- (c) -- (d)
    >>> print(qp.draw(circuit, level="device")(g2, wires=range(4)))
    0: ──H─╭Z─╭●────┤  State
    1: ──H─╰●─│─────┤  State
    2: ──H────╰Z─╭●─┤  State
    3: ──H───────╰Z─┤  State

    As before, ``GraphStatePrep`` defined the node-label-to-wire mapping to be::

        {"a": 0, "b": 1, "c": 2, "d": 3}

    but now, this corresponds to the graph structure with wire indices::

        (1) -- (0) -- (2) -- (3)

    as shown in the circuit diagram.

    While these two circuit might appear to be the same, they are indeed distinct for this
    sequence of wires, and result in different state vectors. It is therefore important to
    remember that the node labels influence how nearest-neighbour wires are interpreted.

### `label`

```python
def label(self, *args, **kwargs) -> str
```

Defines how the graph state preparation is represented in diagrams and drawings.

Args:
    *args (Optional[Union[int, str]]): positional arguments for decimals and base_label.
    **kwargs (Optional[dict]): keyword arguments for cache.

Returns:
    str: label to use in drawings

### `__repr__`

```python
def __repr__(self)
```

Method defining the string representation of this class.

### `compute_decomposition`

```python
def compute_decomposition(wires: Wires, graph: nx.Graph | QubitGraph, one_qubit_ops: Operation=qp.H, two_qubit_ops: Operation=qp.CZ)
```

Representation of the operator as a product of other operators (static method).

.. note::

    Operations making up the decomposition should be queued within the
    ``compute_decomposition`` method.

.. seealso:: :meth:`~.Operator.decomposition`.

Args:
    wires (Wires): Wires the decomposition applies on. Wires will be mapped 1:1 to graph nodes.
    graph (Union[nx.Graph, QubitGraph]): QubitGraph or nx.Graph object mapping qubit to wires.
    one_qubit_ops (Operation): Operator to prepare the initial state of each qubit. Default to :class:`~.pennylane.H`.
    two_qubit_ops (Operation): Operator to entangle nearest qubits. Default to :class:`~.pennylane.CZ`.

Returns:
    list[Operator]: decomposition of the operator
