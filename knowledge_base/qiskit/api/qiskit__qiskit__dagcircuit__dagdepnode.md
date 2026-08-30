---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/dagcircuit/dagdepnode.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/dagcircuit/dagdepnode.py
license: Apache-2.0
---

## Module `qiskit/dagcircuit/dagdepnode.py`

Object to represent the information at a node in the DAGCircuit.

## `DAGDepNode`

```python
class DAGDepNode
```

Object to represent the information at a node in the DAGDependency().

It is used as the return value from `*_nodes()` functions and can
be supplied to functions that take a node.

### `op`

```python
def op(self)
```

Returns the Instruction object corresponding to the op for the node, else None

### `qargs`

```python
def qargs(self)
```

Returns list of Qubit, else an empty list.

### `qargs`

```python
def qargs(self, new_qargs)
```

Sets the qargs to be the given list of qargs.

### `semantic_eq`

```python
def semantic_eq(node1, node2)
```

Check if DAG nodes are considered equivalent, e.g., as a node_match for nx.is_isomorphic.

Args:
    node1 (DAGDepNode): A node to compare.
    node2 (DAGDepNode): The other node to compare.

Return:
    Bool: If node1 == node2

### `copy`

```python
def copy(self)
```

Function to copy a DAGDepNode object.
Returns:
    DAGDepNode: a copy of a DAGDepNode object.
