---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/acquaintance/topological_sort.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/acquaintance/topological_sort.py
license: Apache-2.0
---

## `is_topologically_sorted`

```python
def is_topologically_sorted(dag: cirq.contrib.CircuitDag, operations: cirq.OP_TREE, equals: Callable[[ops.Operation, ops.Operation], bool]=operator.eq) -> bool
```

Whether a given order of operations is consistent with the DAG.

For example, suppose the (transitive reduction of the) circuit DAG is

     ╭─> Op2 ─╮
Op1 ─┤        ├─> Op4
     ╰─> Op3 ─╯

Then [Op1, Op2, Op3, Op4] and [Op1, Op3, Op2, Op4] (and any operations
tree that flattens to one of them) are topologically sorted according
to the DAG, and any other ordering of the four operations is not.

Evaluates to False when the set of operations is different from those
in the nodes of the DAG, regardless of the ordering.

Args:
    dag: The circuit DAG.
    operations: The ordered operations.
    equals: The function to determine equality of operations. Defaults to
        `operator.eq`.

Returns:
    Whether or not the operations given are topologically sorted
    according to the DAG.
