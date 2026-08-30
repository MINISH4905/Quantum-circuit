---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/routing/star_prerouting.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/routing/star_prerouting.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/routing/star_prerouting.py`

Search for star connectivity patterns and replace them with.

## `StarBlock`

```python
class StarBlock
```

Defines blocks representing star-shaped pieces of a circuit.

### `get_nodes`

```python
def get_nodes(self)
```

Returns the list of nodes used in the block.

### `append_node`

```python
def append_node(self, node)
```

If node can be added to block while keeping the block star-shaped, and
return True. Otherwise, does not add node to block and returns False.

### `size`

```python
def size(self)
```

Returns the number of two-qubit quantum gates in this block.

## `StarPreRouting`

```python
class StarPreRouting(TransformationPass)
```

Run star to linear pre-routing

This pass is a logical optimization pass that rewrites any
solely 2q gate star connectivity subcircuit as a linear connectivity
equivalent with swaps.

For example:

  .. plot::
     :alt: Circuit diagram output by the previous code.
     :include-source:

     from qiskit.circuit import QuantumCircuit
     from qiskit.transpiler.passes import StarPreRouting

     qc = QuantumCircuit(10)
     qc.h(0)
     qc.cx(0, range(1, 5))
     qc.h(9)
     qc.cx(9, range(8, 4, -1))
     qc.measure_all()
     StarPreRouting()(qc).draw("mpl")

This pass was inspired by a similar pass described in Section IV of:
C. Campbell et al., "Superstaq: Deep Optimization of Quantum Programs,"
2023 IEEE International Conference on Quantum Computing and Engineering (QCE),
Bellevue, WA, USA, 2023, pp. 1020-1032, doi: 10.1109/QCE57702.2023.00116.

### `__init__`

```python
def __init__(self)
```

StarPreRouting

### `collect_matching_block`

```python
def collect_matching_block(self, dag, filter_fn)
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
def collect_all_matching_blocks(self, dag, min_block_size=2)
```

Collects all blocks that match a given filtering function filter_fn.
This iteratively finds the largest block that does not match filter_fn,
then the largest block that matches filter_fn, and so on, until no more uncollected
nodes remain. Intuitively, finding larger blocks of non-matching nodes helps to
find larger blocks of matching nodes later on. The option ``min_block_size``
specifies the minimum number of gates in the block for the block to be collected.

By default, blocks are collected in the direction from the inputs towards the outputs
of the circuit. The option ``collect_from_back`` allows to change this direction,
that is collect blocks from the outputs towards the inputs of the circuit.

Returns the list of matching blocks only.

### `determine_star_blocks_processing`

```python
def determine_star_blocks_processing(self, dag: DAGCircuit | DAGDependency, min_block_size: int) -> tuple[list[StarBlock], list[DAGOpNode] | list[DAGDepNode]]
```

Returns star blocks in dag and the processing order of nodes within these star blocks
Args:
    dag (DAGCircuit or DAGDependency): a dag on which star blocks should be determined.
    min_block_size (int): minimum number of two-qubit gates in a star block.

Returns:
    List[StarBlock]: a list of star blocks in the given dag
    Union[List[DAGOpNode], List[DAGDepNode]]: a list of operations specifying processing order

### `star_preroute`

```python
def star_preroute(self, dag, blocks, processing_order)
```

Returns star blocks in dag and the processing order of nodes within these star blocks
Args:
    dag (DAGCircuit or DAGDependency): a dag on which star prerouting should be performed.
    blocks (List[StarBlock]): a list of star blocks in the given dag.
    processing_order (Union[List[DAGOpNode], List[DAGDepNode]]): a list of operations specifying
    processing order

Returns:
    new_dag: a dag specifying the pre-routed circuit
    qubit_mapping: the final qubit mapping after pre-routing
