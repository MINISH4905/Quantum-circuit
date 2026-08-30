---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/collect_and_collapse.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/collect_and_collapse.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/collect_and_collapse.py`

Provides a general transpiler pass for collecting and consolidating blocks of nodes
in a circuit.

## `CollectAndCollapse`

```python
class CollectAndCollapse(TransformationPass)
```

A general transpiler pass to collect and to consolidate blocks of nodes
in a circuit.

This transpiler pass depends on two functions: the collection function and the
collapsing function. The collection function ``collect_function`` takes a DAG
and returns a list of blocks. The collapsing function ``collapse_function``
takes a DAG and a list of blocks, consolidates each block, and returns the modified
DAG.

The input and the output DAGs are of type :class:`~qiskit.dagcircuit.DAGCircuit`,
however when exploiting commutativity analysis to collect blocks, the
:class:`~qiskit.dagcircuit.DAGDependency` representation is used internally.
To support this, the ``collect_function`` and ``collapse_function`` should work
with both types of DAGs and DAG nodes.

Other collection and consolidation transpiler passes, for instance
:class:`~.CollectLinearFunctions`, may derive from this pass, fixing
``collect_function`` and ``collapse_function`` to specific functions.

### `__init__`

```python
def __init__(self, collect_function, collapse_function, do_commutative_analysis=False)
```

Args:
    collect_function (callable): a function that takes a DAG and returns a list
        of "collected" blocks of nodes
    collapse_function (callable): a function that takes a DAG and a list of
        "collected" blocks, and consolidates each block.
    do_commutative_analysis (bool): if True, exploits commutativity relations
        between nodes.

### `run`

```python
def run(self, dag)
```

Run the CollectLinearFunctions pass on `dag`.
Args:
    dag (DAGCircuit): the DAG to be optimized.
Returns:
    DAGCircuit: the optimized DAG.

## `collect_using_filter_function`

```python
def collect_using_filter_function(dag, filter_function, split_blocks, min_block_size, split_layers=False, collect_from_back=False, max_block_width=None)
```

Corresponds to an important block collection strategy that greedily collects
maximal blocks of nodes matching a given ``filter_function``.

## `collapse_to_operation`

```python
def collapse_to_operation(dag, blocks, collapse_function)
```

Corresponds to an important block collapsing strategy that collapses every block
to a specific object as specified by ``collapse_function``.
