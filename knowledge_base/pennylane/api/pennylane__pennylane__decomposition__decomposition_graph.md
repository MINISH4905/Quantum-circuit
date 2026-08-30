---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/decomposition/decomposition_graph.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/decomposition/decomposition_graph.py
license: Apache-2.0
---

## Module `pennylane/decomposition/decomposition_graph.py`

Implements the class DecompositionGraph

This module implements a graph-based decomposition algorithm that constructs a graph of operators
connected by decomposition rules, and then traverses it using Dijkstra's algorithm to find the best
decomposition for every operator.

The architecture of this module utilizes design patterns similar to those present in Qiskit's
implementation of the basis translator, the Boost Graph library, and RustworkX.

## `DecompositionGraph`

```python
class DecompositionGraph
```

A graph that models a decomposition problem.

The decomposition graph contains two types of nodes: operator nodes and decomposition nodes.
Each decomposition node is a :class:`pennylane.decomposition.DecompositionRule`, and each
operator node is a :class:`~pennylane.decomposition.resources.CompressedResourceOp` which
contains an operator type and any additional parameters that affect the resource requirements
of the operator. Essentially, two instances of the same operator type are represented by the
same node in the graph if they're expected to have the same decompositions.

There are also two types of directed edges: edges that connect operators to the decomposition
rules that contain them, and edges that connect decomposition rules to the operators that they
decompose. The edge weights represent the difference in the total weights of the gates between
the two states. Edges that connect decomposition rules to operators have a weight of 0 because
an operator can be replaced with its decomposition at no additional cost.

On the other hand, edges that connect operators to the decomposition rule that contains them
will have a weight that is the total resource estimate of the decomposition minus the resource
estimate of the operator. Edges that connect an operator node to a decomposition node have a weight
calculated by the difference of the sum of the gate counts multiplied by their respective gate
weights in the decomposition, minus the weight of the operator of the operator node.

For example, if the graph was initialized with ``{qp.CNOT: 10.0, qp.H: 1.0}`` as the gate set,
the edge that connects a ``CNOT`` to the following decomposition rule:

.. code-block:: python

    import pennylane as qp

    @qp.register_resources({qp.H: 2, qp.CNOT: 1})
    def my_cz(wires):
        qp.H(wires=wires[1])
        qp.CNOT(wires=wires)
        qp.H(wires=wires[1])

will have a weight of (10.0 + 2 * 1.0) - 10.0 = 2, because the decomposition rule contains 2 additional
``H`` gates. Note that this gate count is in terms of gates in the target gate set. If ``H`` isn't
supported and is in turn decomposed to two ``RZ`` gates and one ``RX`` gate, the weight of this edge
becomes 2 * 3 = 6, if ``RZ`` and ``RX`` have weights of 1.0 (the default). This way, the total distance
from the basis gate set to a high-level gate is by default the total number of basis gates required to
decompose this high-level gate, which allows us to use Dijkstra's algorithm to find the most efficient
decomposition. By specifying weights in the target gate set, the total distance calculation involves
a sum of weighted gate counts, which can represent the relative cost of executing a particular element
of the target gate set on the target hardware i.e. a ``T`` gate.

Args:
    operations (list[Operator or CompressedResourceOp]): The list of operations to decompose.
    gate_set (Set | Mapping | GateSet): A set of gates in the target gate set or a dictionary
        mapping gates in the target gate set to their respective weights. All weights must be positive.
    fixed_decomps (dict): A dictionary mapping operator names to fixed decompositions.
    alt_decomps (dict): A dictionary mapping operator names to alternative decompositions.
    strict (bool): If ``False``, treat operators that do not define a decomposition as supported.
        Defaults to ``True``.

**Example**

.. code-block:: python

    from pennylane.decomposition import DecompositionGraph

    op = qp.CRX(0.5, wires=[0, 1])
    graph = DecompositionGraph(
        operations=[op],
        gate_set={"RZ", "RX", "CNOT", "GlobalPhase"},
    )
    solution = graph.solve()

>>> with qp.queuing.AnnotatedQueue() as q:
...     solution.decomposition(op)(0.5, wires=[0, 1])
>>> q.queue
[RZ(1.5707963267948966, wires=[1]),
 RY(0.25, wires=[1]),
 CNOT(wires=[0, 1]),
 RY(-0.25, wires=[1]),
 CNOT(wires=[0, 1]),
 RZ(-1.5707963267948966, wires=[1])]
>>> solution.resource_estimate(op)
<num_gates=10, gate_counts={RZ: 6, CNOT: 2, RX: 2}, weighted_cost=10.0>

### `solve`

```python
def solve(self, num_work_wires: int | None=0, lazy=True, minimize_work_wires=False) -> DecompGraphSolution
```

Solves the graph using the Dijkstra search algorithm.

Args:
    num_work_wires (int, optional): The total number of available work wires. Set this
        to ``None`` if there is an unlimited number of work wires.
    lazy (bool): If True, the Dijkstra search will stop once optimal decompositions are
        found for all operations that the graph was initialized with. Otherwise, the
        entire graph will be explored.
    minimize_work_wires (bool): If True, minimize the number of additional work wires used.

Returns:
    DecompGraphSolution

## `DecompGraphSolution`

```python
class DecompGraphSolution
```

A solution to a decomposition graph.

An instance of this class is returned from :meth:`DecompositionGraph.solve`

**Example**

.. code-block:: python

    from pennylane.decomposition import DecompositionGraph

    op = qp.CRX(0.5, wires=[0, 1])
    graph = DecompositionGraph(
        operations=[op],
        gate_set={"RZ", "RX", "CNOT", "GlobalPhase"},
    )
    solution = graph.solve()

>>> with qp.queuing.AnnotatedQueue() as q:
...     solution.decomposition(op)(0.5, wires=[0, 1])
>>> q.queue
[RZ(1.5707963267948966, wires=[1]),
 RY(0.25, wires=[1]),
 CNOT(wires=[0, 1]),
 RY(-0.25, wires=[1]),
 CNOT(wires=[0, 1]),
 RZ(-1.5707963267948966, wires=[1])]
>>> solution.resource_estimate(op)
<num_gates=10, gate_counts={RZ: 6, CNOT: 2, RX: 2}, weighted_cost=10.0>

### `is_solved_for`

```python
def is_solved_for(self, op: Operator, num_work_wires: int | None=0)
```

Tests whether the decomposition graph is solved for a given operator.

Args:
    op (Operator): The operator to check.
    num_work_wires (int): The number of available work wires to decompose this operator.

### `resource_estimate`

```python
def resource_estimate(self, op: Operator, num_work_wires: int | None=0) -> Resources
```

Returns the resource estimate for a given operator.

Args:
    op (Operator): The operator for which to return the resource estimates.
    num_work_wires (int): The number of work wires available to decompose this operator.

Returns:
    Resources: The resource estimate.

**Example**

The resource estimate is a gate count in terms of the target gate set, not the immediate
set of gates that the operator decomposes to.

.. code-block:: python

    op = qp.CRX(0.5, wires=[0, 1])
    graph = DecompositionGraph(
        operations=[op],
        gate_set={"RZ", "RX", "CNOT", "GlobalPhase"},
    )
    solution = graph.solve()

>>> with qp.queuing.AnnotatedQueue() as q:
...     solution.decomposition(op)(0.5, wires=[0, 1])
>>> q.queue
[RZ(1.5707963267948966, wires=[1]),
 RY(0.25, wires=[1]),
 CNOT(wires=[0, 1]),
 RY(-0.25, wires=[1]),
 CNOT(wires=[0, 1]),
 RZ(-1.5707963267948966, wires=[1])]
>>> solution.resource_estimate(op)
<num_gates=10, gate_counts={RZ: 6, CNOT: 2, RX: 2}, weighted_cost=10.0>

### `decomposition`

```python
def decomposition(self, op: Operator, num_work_wires: int | None=0) -> DecompositionRule
```

Returns the optimal decomposition rule for a given operator.

Args:
    op (Operator): The operator for which to return the optimal decomposition.
    num_work_wires (int): The number of work wires available to decompose this operator.

Returns:
    DecompositionRule: The optimal decomposition.

**Example**

The decomposition rule is a quantum function that takes ``(*op.parameters, wires=op.wires, **op.hyperparameters)``
as arguments.

.. code-block:: python

    op = qp.CRY(0.2, wires=[0, 2])
    graph = DecompositionGraph(
        operations=[op],
        gate_set={"RZ", "RX", "CNOT", "GlobalPhase"},
    )
    solution = graph.solve()
    rule = solution.decomposition(op)

>>> with qp.queuing.AnnotatedQueue() as q:
...     rule(*op.parameters, wires=op.wires, **op.hyperparameters)
>>> q.queue
[PauliRot(0.1, Y, wires=[2]), PauliRot(-0.1, ZY, wires=[0, 2])]

## `DecompositionSearchVisitor`

```python
class DecompositionSearchVisitor(DijkstraVisitor)
```

The visitor used in the Dijkstra search for the optimal decomposition.

### `edge_weight`

```python
def edge_weight(self, edge_obj)
```

Calculates the weight of an edge.

### `discover_vertex`

```python
def discover_vertex(self, v, score)
```

Triggered when a vertex is about to be explored during the Dijkstra search.

### `examine_edge`

```python
def examine_edge(self, edge)
```

Triggered when an edge is examined during the Dijkstra search.

### `edge_relaxed`

```python
def edge_relaxed(self, edge)
```

Triggered when an edge is relaxed during the Dijkstra search.
