---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/circuitdag/circuit_dag.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/circuitdag/circuit_dag.py
license: Apache-2.0
---

## `Unique`

```python
class Unique(Generic[T])
```

A wrapper for a value that doesn't compare equal to other instances.

For example: 5 == 5 but Unique(5) != Unique(5).

Unique is used by CircuitDag to wrap operations because nodes in a graph
are considered the same node if they compare equal to each other.  For
example, `X(q0)` in one moment of a circuit, and `X(q0)` in another moment
of the circuit are wrapped by `cirq.Unique(X(q0))` so they are distinct
nodes in the graph.

## `CircuitDag`

```python
class CircuitDag(networkx.DiGraph)
```

A representation of a Circuit as a directed acyclic graph.

Nodes of the graph are instances of Unique containing each operation of a
circuit.

Edges of the graph are tuples of nodes.  Each edge specifies a required
application order between two operations.  The first must be applied before
the second.

The graph is maximalist (transitive completion).

### `__init__`

```python
def __init__(self, incoming_graph_data: Any=None, *, can_reorder: Callable[[cirq.Operation, cirq.Operation], bool]=_disjoint_qubits) -> None
```

Initializes a CircuitDag.

Args:
    can_reorder: A predicate that determines if two operations may be
        reordered.  Graph edges are created for pairs of operations
        where this returns False.

        The default predicate allows reordering only when the operations
        don't share common qubits.
    incoming_graph_data: Data in initialize the graph.  This can be any
        value supported by networkx.DiGraph() e.g. an edge list or
        another graph.
    device: Hardware that the circuit should be able to run on.

### `findall_nodes_until_blocked`

```python
def findall_nodes_until_blocked(self, is_blocker: Callable[[cirq.Operation], bool]) -> Iterator[Unique[cirq.Operation]]
```

Finds all nodes before blocking ones.

Args:
    is_blocker: The predicate that indicates whether or not an
    operation is blocking.
