---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qaoa/cycle.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qaoa/cycle.py
license: Apache-2.0
---

## Module `pennylane/qaoa/cycle.py`

Functionality for finding the maximum weighted cycle of directed graphs.

## `edges_to_wires`

```python
def edges_to_wires(graph: nx_Graph | rx.PyGraph | rx.PyDiGraph) -> dict[tuple, int]
```

Maps the edges of a graph to corresponding wires.

**Example**

>>> g = nx.complete_graph(4).to_directed()
>>> edges_to_wires(g)
{(0, 1): 0,
 (0, 2): 1,
 (0, 3): 2,
 (1, 0): 3,
 (1, 2): 4,
 (1, 3): 5,
 (2, 0): 6,
 (2, 1): 7,
 (2, 3): 8,
 (3, 0): 9,
 (3, 1): 10,
 (3, 2): 11}

>>> g = rx.generators.directed_mesh_graph(4, [0,1,2,3])
>>> edges_to_wires(g)
{(0, 1): 0,
 (0, 2): 1,
 (0, 3): 2,
 (1, 0): 3,
 (1, 2): 4,
 (1, 3): 5,
 (2, 0): 6,
 (2, 1): 7,
 (2, 3): 8,
 (3, 0): 9,
 (3, 1): 10,
 (3, 2): 11}

Args:
    graph (nx.Graph or rx.PyGraph or rx.PyDiGraph): the graph specifying possible edges

Returns:
    Dict[Tuple, int]: a mapping from graph edges to wires

## `wires_to_edges`

```python
def wires_to_edges(graph: nx_Graph | rx.PyGraph | rx.PyDiGraph) -> dict[int, tuple]
```

Maps the wires of a register of qubits to corresponding edges.

**Example**

>>> g = nx.complete_graph(4).to_directed()
>>> wires_to_edges(g)
{0: (0, 1),
 1: (0, 2),
 2: (0, 3),
 3: (1, 0),
 4: (1, 2),
 5: (1, 3),
 6: (2, 0),
 7: (2, 1),
 8: (2, 3),
 9: (3, 0),
 10: (3, 1),
 11: (3, 2)}

>>> g = rx.generators.directed_mesh_graph(4, [0,1,2,3])
>>> wires_to_edges(g)
{0: (0, 1),
 1: (0, 2),
 2: (0, 3),
 3: (1, 0),
 4: (1, 2),
 5: (1, 3),
 6: (2, 0),
 7: (2, 1),
 8: (2, 3),
 9: (3, 0),
 10: (3, 1),
 11: (3, 2)}

Args:
    graph (nx.Graph or rx.PyGraph or rx.PyDiGraph): the graph specifying possible edges

Returns:
    Dict[Tuple, int]: a mapping from wires to graph edges

## `cycle_mixer`

```python
def cycle_mixer(graph: nx_DiGraph | rx.PyDiGraph) -> Operator
```

Calculates the cycle-mixer Hamiltonian.

Following methods outlined `here <https://arxiv.org/abs/1709.03489>`__, the
cycle-mixer Hamiltonian preserves the set of valid cycles:

.. math::
    \frac{1}{4}\sum_{(i, j)\in E}
    \left(\sum_{k \in V, k\neq i, k\neq j, (i, k) \in E, (k, j) \in E}
    \left[X_{ij}X_{ik}X_{kj} +Y_{ij}Y_{ik}X_{kj} + Y_{ij}X_{ik}Y_{kj} - X_{ij}Y_{ik}Y_{kj}\right]
    \right)

where :math:`E` are the edges of the directed graph. A valid cycle is defined as a subset of
edges in :math:`E` such that all of the graph's nodes :math:`V` have zero net flow (see the
:func:`~.net_flow_constraint` function).

**Example**

>>> import networkx as nx
>>> g = nx.complete_graph(3).to_directed()
>>> h_m = cycle_mixer(g)
>>> print(h_m)
  (-0.25) [X0 Y1 Y5]
+ (-0.25) [X1 Y0 Y3]
+ (-0.25) [X2 Y3 Y4]
+ (-0.25) [X3 Y2 Y1]
+ (-0.25) [X4 Y5 Y2]
+ (-0.25) [X5 Y4 Y0]
+ (0.25) [X0 X1 X5]
+ (0.25) [Y0 Y1 X5]
+ (0.25) [Y0 X1 Y5]
+ (0.25) [X1 X0 X3]
+ (0.25) [Y1 Y0 X3]
+ (0.25) [Y1 X0 Y3]
+ (0.25) [X2 X3 X4]
+ (0.25) [Y2 Y3 X4]
+ (0.25) [Y2 X3 Y4]
+ (0.25) [X3 X2 X1]
+ (0.25) [Y3 Y2 X1]
+ (0.25) [Y3 X2 Y1]
+ (0.25) [X4 X5 X2]
+ (0.25) [Y4 Y5 X2]
+ (0.25) [Y4 X5 Y2]
+ (0.25) [X5 X4 X0]
+ (0.25) [Y5 Y4 X0]
+ (0.25) [Y5 X4 Y0]

>>> import rustworkx as rx
>>> g = rx.generators.directed_mesh_graph(3, [0,1,2])
>>> h_m = cycle_mixer(g)
>>> print(h_m)
  (-0.25) [X0 Y1 Y5]
+ (-0.25) [X1 Y0 Y3]
+ (-0.25) [X2 Y3 Y4]
+ (-0.25) [X3 Y2 Y1]
+ (-0.25) [X4 Y5 Y2]
+ (-0.25) [X5 Y4 Y0]
+ (0.25) [X0 X1 X5]
+ (0.25) [Y0 Y1 X5]
+ (0.25) [Y0 X1 Y5]
+ (0.25) [X1 X0 X3]
+ (0.25) [Y1 Y0 X3]
+ (0.25) [Y1 X0 Y3]
+ (0.25) [X2 X3 X4]
+ (0.25) [Y2 Y3 X4]
+ (0.25) [Y2 X3 Y4]
+ (0.25) [X3 X2 X1]
+ (0.25) [Y3 Y2 X1]
+ (0.25) [Y3 X2 Y1]
+ (0.25) [X4 X5 X2]
+ (0.25) [Y4 Y5 X2]
+ (0.25) [Y4 X5 Y2]
+ (0.25) [X5 X4 X0]
+ (0.25) [Y5 Y4 X0]
+ (0.25) [Y5 X4 Y0]

Args:
    graph (nx.DiGraph or rx.PyDiGraph): the directed graph specifying possible edges

Returns:
    qp.Hamiltonian: the cycle-mixer Hamiltonian

## `loss_hamiltonian`

```python
def loss_hamiltonian(graph: nx_Graph | rx.PyGraph | rx.PyDiGraph) -> Operator
```

Calculates the loss Hamiltonian for the maximum-weighted cycle problem.

We consider the problem of selecting a cycle from a graph that has the greatest product of edge
weights, as outlined `here <https://1qbit.com/whitepaper/arbitrage/>`__. The product of weights
of a subset of edges in a graph is given by

.. math:: P = \prod_{(i, j) \in E} [(c_{ij} - 1)x_{ij} + 1]

where :math:`E` are the edges of the graph, :math:`x_{ij}` is a binary number that selects
whether to include the edge :math:`(i, j)` and :math:`c_{ij}` is the corresponding edge weight.
Our objective is to maximize :math:`P`, subject to selecting the :math:`x_{ij}` so that
our subset of edges composes a cycle.

The product of edge weights is maximized by equivalently considering

.. math:: \sum_{(i, j) \in E} x_{ij}\log c_{ij},

assuming :math:`c_{ij} > 0`.

This can be restated as a minimization of the expectation value of the following qubit
Hamiltonian:

.. math::

    H = \sum_{(i, j) \in E} Z_{ij}\log c_{ij}.

where :math:`Z_{ij}` is a qubit Pauli-Z matrix acting upon the wire specified by the edge
:math:`(i, j)`. Mapping from edges to wires can be achieved using :func:`~.edges_to_wires`.

.. note::
    The expectation value of the returned Hamiltonian :math:`H` is not equal to :math:`P`, but
    minimizing the expectation value of :math:`H` is equivalent to maximizing :math:`P`.

    Also note that the returned Hamiltonian does not impose that the selected set of edges is
    a cycle. This constraint can be enforced using a penalty term or by selecting a QAOA
    mixer Hamiltonian that only transitions between states that correspond to cycles.

**Example**

>>> import networkx as nx
>>> g = nx.complete_graph(3).to_directed()
>>> edge_weight_data = {edge: (i + 1) * 0.5 for i, edge in enumerate(g.edges)}
>>> for k, v in edge_weight_data.items():
        g[k[0]][k[1]]["weight"] = v
>>> h = loss_hamiltonian(g)
>>> h
(
    -0.6931471805599453 * Z(0)
  + 0.0 * Z(1)
  + 0.4054651081081644 * Z(2)
  + 0.6931471805599453 * Z(3)
  + 0.9162907318741551 * Z(4)
  + 1.0986122886681098 * Z(5)
)

>>> import rustworkx as rx
>>> g = rx.generators.directed_mesh_graph(3, [0, 1, 2])
>>> edge_weight_data = {edge: (i + 1) * 0.5 for i, edge in enumerate(sorted(g.edge_list()))}
>>> for k, v in edge_weight_data.items():
        g.update_edge(k[0], k[1], {"weight": v})
>>> h = loss_hamiltonian(g)
>>> print(h)
(
    -0.6931471805599453 * Z(0)
  + 0.0 * Z(1)
  + 0.4054651081081644 * Z(2)
  + 0.6931471805599453 * Z(3)
  + 0.9162907318741551 * Z(4)
  + 1.0986122886681098 * Z(5)
)

Args:
    graph (nx.Graph or rx.PyGraph or rx.PyDiGraph): the graph specifying possible edges

Returns:
    qp.Hamiltonian: the loss Hamiltonian

Raises:
    ValueError: if the graph contains self-loops
    KeyError: if one or more edges do not contain weight data

## `out_flow_constraint`

```python
def out_flow_constraint(graph: nx_DiGraph | rx.PyDiGraph) -> Operator
```

Calculates the `out flow constraint <https://1qbit.com/whitepaper/arbitrage/>`__
Hamiltonian for the maximum-weighted cycle problem.

Given a subset of edges in a directed graph, the out-flow constraint imposes that at most one
edge can leave any given node, i.e., for all :math:`i`:

.. math:: \sum_{j,(i,j)\in E}x_{ij} \leq 1,

where :math:`E` are the edges of the graph and :math:`x_{ij}` is a binary number that selects
whether to include the edge :math:`(i, j)`.

A set of edges satisfies the out-flow constraint whenever the following Hamiltonian is minimized:

.. math::

    \sum_{i\in V}\left(d_{i}^{out}(d_{i}^{out} - 2)\mathbb{I}
    - 2(d_{i}^{out}-1)\sum_{j,(i,j)\in E}\hat{Z}_{ij} +
    \left( \sum_{j,(i,j)\in E}\hat{Z}_{ij} \right)^{2}\right)


where :math:`V` are the graph vertices, :math:`d_{i}^{\rm out}` is the outdegree of node
:math:`i`, and :math:`Z_{ij}` is a qubit Pauli-Z matrix acting
upon the qubit specified by the pair :math:`(i, j)`. Mapping from edges to wires can be achieved
using :func:`~.edges_to_wires`.

Args:
    graph (nx.DiGraph or rx.PyDiGraph): the directed graph specifying possible edges

Returns:
    qp.Hamiltonian: the out flow constraint Hamiltonian

Raises:
    ValueError: if the input graph is not directed

## `net_flow_constraint`

```python
def net_flow_constraint(graph: nx_DiGraph | rx.PyDiGraph) -> Operator
```

Calculates the `net flow constraint <https://doi.org/10.1080/0020739X.2010.526248>`__
Hamiltonian for the maximum-weighted cycle problem.

Given a subset of edges in a directed graph, the net-flow constraint imposes that the number of
edges leaving any given node is equal to the number of edges entering the node, i.e.,

.. math:: \sum_{j, (i, j) \in E} x_{ij} = \sum_{j, (j, i) \in E} x_{ji},

for all nodes :math:`i`, where :math:`E` are the edges of the graph and :math:`x_{ij}` is a
binary number that selects whether to include the edge :math:`(i, j)`.

A set of edges has zero net flow whenever the following Hamiltonian is minimized:

.. math::

    \sum_{i \in V} \left((d_{i}^{\rm out} - d_{i}^{\rm in})\mathbb{I} -
    \sum_{j, (i, j) \in E} Z_{ij} + \sum_{j, (j, i) \in E} Z_{ji} \right)^{2},

where :math:`V` are the graph vertices, :math:`d_{i}^{\rm out}` and :math:`d_{i}^{\rm in}` are
the outdegree and indegree, respectively, of node :math:`i` and :math:`Z_{ij}` is a qubit
Pauli-Z matrix acting upon the wire specified by the pair :math:`(i, j)`. Mapping from edges to
wires can be achieved using :func:`~.edges_to_wires`.


Args:
    graph (nx.DiGraph or rx.PyDiGraph): the directed graph specifying possible edges

Returns:
    qp.Hamiltonian: the net-flow constraint Hamiltonian

Raises:
    ValueError: if the input graph is not directed
