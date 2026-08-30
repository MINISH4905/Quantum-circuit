---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/dagcircuit/collect_blocks.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/dagcircuit/collect_blocks.py
license: Apache-2.0
---

## Module `qiskit/dagcircuit/collect_blocks.py`

Various ways to divide a DAG into blocks of nodes, to split blocks of nodes
into smaller sub-blocks, and to consolidate blocks.

## `BlockCollector`

```python
class BlockCollector
```

This class implements various strategies of dividing a DAG (directed acyclic graph)
into blocks of nodes that satisfy certain criteria. It works both with the
:class:`~qiskit.dagcircuit.DAGCircuit` and
:class:`~qiskit.dagcircuit.DAGDependency` representations of a DAG, where
the latter takes into account commutativity between nodes.

Collecting nodes from DAGDependency generally leads to more optimal results, but is
slower, as it requires to construct a DAGDependency beforehand. Thus, DAGCircuit should
be used with lower transpiler settings, and DAGDependency should be used with higher
transpiler settings.

In general, there are multiple ways to collect maximal blocks. The approaches used
here are of the form 'starting from the input nodes of a DAG, greedily collect
the largest block of nodes that match certain criteria'. For additional details,
see https://github.com/Qiskit/qiskit-terra/issues/5775.

### `__init__`

```python
def __init__(self, dag: DAGCircuit | DAGDependency)
```

Args:
    dag (Union[DAGCircuit, DAGDependency]): The input DAG.

Raises:
    DAGCircuitError: the input object is not a DAG.

### `collect_matching_block`

```python
def collect_matching_block(self, filter_fn: Callable, max_block_width: int | None) -> list[DAGOpNode | DAGDepNode]
```

Iteratively collects the largest block of input nodes (that is, nodes with
``_in_degree`` equal to 0) that match a given filtering function.
Examples of this include collecting blocks of swap gates,
blocks of linear gates (CXs and SWAPs), blocks of Clifford gates, blocks of single-qubit gates,
blocks of two-qubit gates, etc.  Here 'iteratively' means that once a node is collected,
the ``_in_degree`` of each of its immediate successor is decreased by 1, allowing more nodes
to become input and to be eligible for collecting into the current block.
Returns the block of collected nodes.

### `collect_all_matching_blocks`

```python
def collect_all_matching_blocks(self, filter_fn, split_blocks=True, min_block_size=2, split_layers=False, collect_from_back=False, max_block_width=None)
```

Collects all blocks that match a given filtering function filter_fn.
This iteratively finds the largest block that does not match filter_fn,
then the largest block that matches filter_fn, and so on, until no more uncollected
nodes remain. Intuitively, finding larger blocks of non-matching nodes helps to
find larger blocks of matching nodes later on.

After the blocks are collected, they can be optionally refined. The option
``split_blocks`` allows to split collected blocks into sub-blocks over disjoint
qubit subsets. The option ``split_layers`` allows to split collected blocks
into layers of non-overlapping instructions. The option ``min_block_size``
specifies the minimum number of gates in the block for the block to be collected.
The option ``max_block_width`` specifies the maximum number of qubits over
which a block can be defined.

By default, blocks are collected in the direction from the inputs towards the outputs
of the circuit. The option ``collect_from_back`` allows to change this direction,
that is collect blocks from the outputs towards the inputs of the circuit.

Returns the list of matching blocks only.

## `BlockSplitter`

```python
class BlockSplitter
```

Splits a block of nodes into sub-blocks over disjoint qubits.
The implementation is based on the Disjoint Set Union data structure.

### `find_leader`

```python
def find_leader(self, index)
```

Find in DSU.

### `union_leaders`

```python
def union_leaders(self, index1, index2)
```

Union in DSU.

### `run`

```python
def run(self, block)
```

Splits block of nodes into sub-blocks over disjoint qubits.

## `split_block_into_layers`

```python
def split_block_into_layers(block: list[DAGOpNode | DAGDepNode])
```

Splits a block of nodes into sub-blocks of non-overlapping instructions
(or, in other words, into depth-1 sub-blocks).

## `BlockCollapser`

```python
class BlockCollapser
```

This class implements various strategies of consolidating blocks of nodes
in a DAG (directed acyclic graph). It works both with
the :class:`~qiskit.dagcircuit.DAGCircuit`
and :class:`~qiskit.dagcircuit.DAGDependency` DAG representations.

### `__init__`

```python
def __init__(self, dag)
```

Args:
    dag (Union[DAGCircuit, DAGDependency]): The input DAG.

Raises:
    DAGCircuitError: the input object is not a DAG.

### `collapse_to_operation`

```python
def collapse_to_operation(self, blocks, collapse_fn)
```

For each block, constructs a quantum circuit containing instructions in the block,
then uses collapse_fn to collapse this circuit into a single operation.
