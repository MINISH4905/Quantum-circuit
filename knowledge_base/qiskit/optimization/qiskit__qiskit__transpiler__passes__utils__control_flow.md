---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/utils/control_flow.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/utils/control_flow.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/utils/control_flow.py`

Internal utilities for working with control-flow operations.

## `map_blocks`

```python
def map_blocks(dag_mapping: Callable[[DAGCircuit], DAGCircuit], op: ControlFlowOp) -> ControlFlowOp
```

Use the ``dag_mapping`` function to replace the blocks of a :class:`.ControlFlowOp` with new
ones.  Each block will be automatically converted to a :class:`.DAGCircuit` and then returned
to a :class:`.QuantumCircuit`.

## `trivial_recurse`

```python
def trivial_recurse(method)
```

Decorator that causes :class:`.BasePass.run` to iterate over all control-flow nodes,
replacing their operations with a new :class:`.ControlFlowOp` whose blocks have all had
:class`.BasePass.run` called on them.

This is only suitable for simple run calls that store no state between calls, do not need
circuit-specific information feeding into them (such as via a :class:`.PropertySet`), and will
safely do nothing to control-flow operations that are in the DAG.

If slightly finer control is needed on when the control-flow operations are modified, one can
use :func:`map_blocks` as::

    if isinstance(node.op, ControlFlowOp):
        dag.substitute_node(node, map_blocks(self.run, node.op))

from with :meth:`.BasePass.run`.
