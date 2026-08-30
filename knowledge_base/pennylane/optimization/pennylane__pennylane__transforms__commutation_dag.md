---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/commutation_dag.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/commutation_dag.py
license: Apache-2.0
---

## Module `pennylane/transforms/commutation_dag.py`

A transform to obtain the commutation DAG of a quantum circuit.

## `commutation_dag`

```python
def commutation_dag(tape: QuantumScript) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Construct the pairwise-commutation DAG (directed acyclic graph) representation of a quantum circuit.

In the DAG, each node represents a quantum operation, and edges represent
non-commutation between two operations.

This transform takes into account that not all
operations can be moved next to each other by pairwise commutation.

Args:
    tape (QNode or QuantumTape or Callable): The quantum circuit.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`. Executing this circuit
    will provide the commutation DAG.

**Example**

>>> dev = qp.device("default.qubit")

.. code-block:: python

    @qp.qnode(device=dev)
    def circuit(x, y, z):
        qp.RX(x, wires=0)
        qp.RX(y, wires=0)
        qp.CNOT(wires=[1, 2])
        qp.RY(y, wires=1)
        qp.Hadamard(wires=2)
        qp.CRZ(z, wires=[2, 0])
        qp.RY(-y, wires=1)
        return qp.expval(qp.Z(0))

The commutation dag can be returned by using the following code:

>>> dag_fn = commutation_dag(circuit)
>>> dag = dag_fn(np.pi / 4, np.pi / 3, np.pi / 2)

Nodes in the commutation DAG can be accessed via the :meth:`~.get_nodes` method, returning a list of
the  form ``(ID, CommutationDAGNode)``:

>>> nodes = dag.get_nodes()
>>> nodes
NodeDataView({0: <pennylane.transforms.commutation_dag.CommutationDAGNode object at ...>, ...}, data='node')

You can also access specific nodes (of type :class:`~.CommutationDAGNode`) by using the :meth:`~.get_node`
method. See :class:`~.CommutationDAGNode` for a list of available
node attributes.

>>> second_node = dag.get_node(2)
>>> second_node
<pennylane.transforms.commutation_dag.CommutationDAGNode object at ...>
>>> second_node.op
CNOT(wires=[1, 2])
>>> second_node.successors
[3, 4, 5, 6]
>>> second_node.predecessors
[]

For more details, see:

* Iten, R., Moyard, R., Metger, T., Sutter, D., Woerner, S.
  "Exact and practical pattern matching for quantum circuit optimization" `doi.org/10.1145/3498325
  <https://dl.acm.org/doi/abs/10.1145/3498325>`_

## `CommutationDAGNode`

```python
class CommutationDAGNode
```

Class to store information about a quantum operation in a node of the
commutation DAG.

Args:
    op (.Operation): PennyLane operation.
    wires (.Wires): Wires on which the operation acts on.
    node_id (int): ID of the node in the DAG.
    successors (array[int]): List of the node's successors in the DAG.
    predecessors (array[int]): List of the node's predecessors in the DAG.
    reachable (bool): Attribute used to check reachability by pairwise commutation.

## `CommutationDAG`

```python
class CommutationDAG
```

Class to represent a quantum circuit as a directed acyclic graph (DAG). This class is useful to build the
commutation DAG and set up all nodes attributes. The construction of the DAG should be used through the
transform :class:`qp.transforms.commutation_dag`.

Args:
    tape (.QuantumTape): PennyLane quantum tape representing a quantum circuit.

**Reference:**

[1] Iten, R., Moyard, R., Metger, T., Sutter, D. and Woerner, S., 2020.
Exact and practical pattern matching for quantum circuit optimization.
`doi.org/10.1145/3498325 <https://dl.acm.org/doi/abs/10.1145/3498325>`_

### `add_node`

```python
def add_node(self, operation)
```

Add the operation as a node in the DAG and updates the edges.

Args:
    operation (qp.operation): PennyLane quantum operation to add to the DAG.

### `get_node`

```python
def get_node(self, node_id)
```

Add the operation as a node in the DAG and updates the edges.

Args:
    node_id (int): PennyLane quantum operation to add to the DAG.

Returns:
    CommutationDAGNOde: The node with the given id.

### `get_nodes`

```python
def get_nodes(self)
```

Return iterable to loop through all the nodes in the DAG.

Returns:
    networkx.classes.reportviews.NodeDataView: Iterable nodes.

### `add_edge`

```python
def add_edge(self, node_in, node_out)
```

Add an edge (non commutation) between node_in and node_out.

Args:
    node_in (int): Id of the ingoing node.
    node_out (int): Id of the outgoing node.

Returns:
    int: Id of the created edge.

### `get_edge`

```python
def get_edge(self, node_in, node_out)
```

Get the edge between two nodes if it exists.

Args:
    node_in (int): Id of the ingoing node.
    node_out (int): Id of the outgoing node.

Returns:
    dict or None: Default weight is 0, it returns None when there is no edge.

### `get_edges`

```python
def get_edges(self)
```

Get all edges as an iterable.

Returns:
    networkx.classes.reportviews.OutMultiEdgeDataView: Iterable over all edges.

### `direct_predecessors`

```python
def direct_predecessors(self, node_id)
```

Return the direct predecessors of the given node.

Args:
    node_id (int): Id of the node in the DAG.

Returns:
    list[int]: List of the direct predecessors of the given node.

### `predecessors`

```python
def predecessors(self, node_id)
```

Return the predecessors of the given node.

Args:
    node_id (int): Id of the node in the DAG.

Returns:
    list[int]: List of the predecessors of the given node.

### `direct_successors`

```python
def direct_successors(self, node_id)
```

Return the direct successors of the given node.

Args:
    node_id (int): Id of the node in the DAG.

Returns:
    list[int]: List of the direct successors of the given node.

### `successors`

```python
def successors(self, node_id)
```

Return the successors of the given node.

Args:
    node_id (int): Id of the node in the DAG.

Returns:
    list[int]: List of the successors of the given node.

### `graph`

```python
def graph(self)
```

Return the DAG object.

Returns:
    networkx.MultiDiGraph(): Networkx representation of the DAG.

### `size`

```python
def size(self)
```

Return the size of the DAG object.

Returns:
    int: Number of nodes in the DAG.

### `draw`

```python
def draw(self, filename='dag.png')
```

Draw the DAG object.

Args:
    filename (str): The file name which is in PNG format. Default = 'dag.png'
