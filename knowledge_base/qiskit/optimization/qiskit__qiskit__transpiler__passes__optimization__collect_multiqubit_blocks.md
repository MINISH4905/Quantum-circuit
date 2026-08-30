---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/collect_multiqubit_blocks.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/collect_multiqubit_blocks.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/collect_multiqubit_blocks.py`

Collect sequences of uninterrupted gates acting on a number of qubits.

## `CollectMultiQBlocks`

```python
class CollectMultiQBlocks(AnalysisPass)
```

Collect sequences of uninterrupted gates acting on groups of qubits.
``max_block_size`` specifies the maximum number of qubits that can be acted upon
by any single group of gates

Traverse the DAG and find blocks of gates that act consecutively on
groups of qubits. Write the blocks to ``property_set`` as a list of blocks
of the form::

    [[g0, g1, g2], [g4, g5]]

Blocks are reported in a valid topological order. Further, the gates
within each block are also reported in topological order
Some gates may not be present in any block (e.g. if the number
of operands is greater than ``max_block_size``)

By default, blocks are collected in the direction from the inputs towards the
outputs of the DAG. The option ``collect_from_back`` allows to change this
direction, that is to collect blocks from the outputs towards the inputs.
Note that the blocks are still reported in a valid topological order.

A Disjoint Set Union data structure (DSU) is used to maintain blocks as
gates are processed. This data structure points each qubit to a set at all
times and the sets correspond to current blocks. These change over time
and the data structure allows these changes to be done quickly.

### `find_set`

```python
def find_set(self, index)
```

DSU function for finding root of set of items
If my parent is myself, I am the root. Otherwise we recursively
find the root for my parent. After that, we assign my parent to be
my root, saving recursion in the future.

### `union_set`

```python
def union_set(self, set1, set2)
```

DSU function for unioning two sets together
Find the roots of each set. Then assign one to have the other
as its parent, thus linking the sets.
Merges smaller set into larger set in order to have better runtime

### `run`

```python
def run(self, dag)
```

Run the CollectMultiQBlocks pass on `dag`.

The blocks contain "op" nodes in topological sort order
such that all gates in a block act on the same set of
qubits and are adjacent in the circuit.

The blocks are built by examining predecessors and successors of
"cx" gates in the circuit. u1, u2, u3, cx, id gates will be included.

After the execution, ``property_set['block_list']`` is set to
a list of tuples of ``DAGNode`` objects
