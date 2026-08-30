---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/dagcircuit/dagdependency.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/dagcircuit/dagdependency.py
license: Apache-2.0
---

## Module `qiskit/dagcircuit/dagdependency.py`

DAGDependency class for representing non-commutativity in a circuit.

## `DAGDependency`

```python
class DAGDependency
```

Object to represent a quantum circuit as a Directed Acyclic Graph (DAG)
via operation dependencies (i.e. lack of commutation).

The nodes in the graph are operations represented by quantum gates.
The edges correspond to non-commutation between two operations
(i.e. a dependency). A directed edge from node A to node B means that
operation A does not commute with operation B.
The object's methods allow circuits to be constructed.

The nodes in the graph have the following attributes:
'operation', 'successors', 'predecessors'.

**Example:**

Bell circuit with no measurement.

.. code-block:: text

          ┌───┐
    qr_0: ┤ H ├──■──
          └───┘┌─┴─┐
    qr_1: ─────┤ X ├
               └───┘

The dependency DAG for the above circuit is represented by two nodes.
The first one corresponds to Hadamard gate, the second one to the CNOT gate
as the gates do not commute there is an edge between the two nodes.

**Reference:**

[1] Iten, R., Moyard, R., Metger, T., Sutter, D. and Woerner, S., 2020.
Exact and practical pattern matching for quantum circuit optimization.
`arXiv:1909.05270 <https://arxiv.org/abs/1909.05270>`_

### `__init__`

```python
def __init__(self)
```

Create an empty DAGDependency.

### `global_phase`

```python
def global_phase(self)
```

Return the global phase of the circuit.

### `global_phase`

```python
def global_phase(self, angle: float | ParameterExpression)
```

Set the global phase of the circuit.

Args:
    angle (float, ParameterExpression): The angle to set the global phase to.

### `to_retworkx`

```python
def to_retworkx(self)
```

Returns the DAGDependency in retworkx format.

### `size`

```python
def size(self)
```

Returns the number of gates in the circuit

### `depth`

```python
def depth(self)
```

Return the circuit depth.
Returns:
    int: the circuit depth

### `add_qubits`

```python
def add_qubits(self, qubits)
```

Add individual qubit wires.

### `add_clbits`

```python
def add_clbits(self, clbits)
```

Add individual clbit wires.

### `add_qreg`

```python
def add_qreg(self, qreg)
```

Add qubits in a quantum register.

### `add_creg`

```python
def add_creg(self, creg)
```

Add clbits in a classical register.

### `get_nodes`

```python
def get_nodes(self) -> Iterator[DAGDepNode]
```

Returns:
    generator(dict): iterator over all the nodes.

### `get_node`

```python
def get_node(self, node_id: int) -> DAGDepNode
```

Args:
    node_id (int): label of considered node.

Returns:
    node: corresponding to the label.

### `get_edges`

```python
def get_edges(self, src_id, dest_id)
```

Edge enumeration between two nodes through method get_all_edge_data.

Args:
    src_id (int): label of the first node.
    dest_id (int): label of the second node.

Returns:
    List: corresponding to all edges between the two nodes.

### `get_all_edges`

```python
def get_all_edges(self)
```

Enumeration of all edges.

Returns:
    List: corresponding to the label.

### `get_in_edges`

```python
def get_in_edges(self, node_id)
```

Enumeration of all incoming edges for a given node.

Args:
    node_id (int): label of considered node.

Returns:
    List: corresponding incoming edges data.

### `get_out_edges`

```python
def get_out_edges(self, node_id)
```

Enumeration of all outgoing edges for a given node.

Args:
    node_id (int): label of considered node.

Returns:
    List: corresponding outgoing edges data.

### `direct_successors`

```python
def direct_successors(self, node_id: int) -> list[int]
```

Direct successors id of a given node as sorted list.

Args:
    node_id (int): label of considered node.

Returns:
    List: direct successors id as a sorted list

### `direct_predecessors`

```python
def direct_predecessors(self, node_id)
```

Direct predecessors id of a given node as sorted list.

Args:
    node_id (int): label of considered node.

Returns:
    List: direct predecessors id as a sorted list

### `successors`

```python
def successors(self, node_id: int) -> list[int]
```

Successors id of a given node as sorted list.

Args:
    node_id (int): label of considered node.

Returns:
    List: all successors id as a sorted list

### `predecessors`

```python
def predecessors(self, node_id: int) -> list[int]
```

Predecessors id of a given node as sorted list.

Args:
    node_id (int): label of considered node.

Returns:
    List: all predecessors id as a sorted list

### `topological_nodes`

```python
def topological_nodes(self)
```

Yield nodes in topological order.

Returns:
    generator(DAGNode): node in topological order.

### `add_op_node`

```python
def add_op_node(self, operation, qargs, cargs)
```

Add a DAGDepNode to the graph and update the edges.

Args:
    operation (qiskit.circuit.Operation): operation as a quantum gate
    qargs (list[~qiskit.circuit.Qubit]): list of qubits on which the operation acts
    cargs (list[Clbit]): list of classical wires to attach to

### `copy`

```python
def copy(self)
```

Function to copy a DAGDependency object.
Returns:
    DAGDependency: a copy of a DAGDependency object.

### `draw`

```python
def draw(self, scale=0.7, filename=None, style='color')
```

Draws the DAGDependency graph.

This function needs `pydot <https://github.com/erocarrera/pydot>`_, which in turn needs
`Graphviz <https://www.graphviz.org/>`_ to be installed.

.. warning::
    This function will call the system Graphviz tool on a file involving user-controllable
    strings (such as gate labels or register names).  It is recommended to only call this
    function on trusted input.

Args:
    scale (float): scaling factor
    filename (str): file path to save image to (format inferred from name)
    style (str): 'plain': B&W graph
                 'color' (default): color input/output/op nodes

Returns:
    IPython.display.Image: if in Jupyter notebook and not saving to file, otherwise None.

### `replace_block_with_op`

```python
def replace_block_with_op(self, node_block, op, wire_pos_map, cycle_check=True)
```

Replace a block of nodes with a single node.

This is used to consolidate a block of DAGDepNodes into a single
operation. A typical example is a block of CX and SWAP gates consolidated
into a LinearFunction. This function is an adaptation of a similar
function from DAGCircuit.

It is important that such consolidation preserves commutativity assumptions
present in DAGDependency. As an example, suppose that every node in a
block [A, B, C, D] commutes with another node E. Let F be the consolidated
node, F = A o B o C o D. Then F also commutes with E, and thus the result of
replacing [A, B, C, D] by F results in a valid DAGDependency. That is, any
deduction about commutativity in consolidated DAGDependency is correct.
On the other hand, suppose that at least one of the nodes, say B, does not commute
with E. Then the consolidated DAGDependency would imply that F does not commute
with E. Even though F and E may actually commute, it is still safe to assume that
they do not. That is, the current implementation of consolidation may lead to
suboptimal but not to incorrect results.

Args:
    node_block (List[DAGDepNode]): A list of dag nodes that represents the
        node block to be replaced
    op (qiskit.circuit.Operation): The operation to replace the
        block with
    wire_pos_map (Dict[~qiskit.circuit.Qubit, int]): The dictionary mapping the qarg to
        the position. This is necessary to reconstruct the qarg order
        over multiple gates in the combined single op node.
    cycle_check (bool): When set to True this method will check that
        replacing the provided ``node_block`` with a single node
        would introduce a cycle (which would invalidate the
        ``DAGDependency``) and will raise a ``DAGDependencyError`` if a cycle
        would be introduced. This checking comes with a run time
        penalty. If you can guarantee that your input ``node_block`` is
        a contiguous block and won't introduce a cycle when it's
        contracted to a single node, this can be set to ``False`` to
        improve the runtime performance of this method.
Raises:
    DAGDependencyError: if ``cycle_check`` is set to ``True`` and replacing
        the specified block introduces a cycle or if ``node_block`` is
        empty.

## `merge_no_duplicates`

```python
def merge_no_duplicates(*iterables)
```

Merge K lists without duplicates using Python heapq ordered merging.

Args:
    *iterables: A list of K sorted lists.

Yields:
    Iterator: List from the merging of the K lists (without duplicates).
