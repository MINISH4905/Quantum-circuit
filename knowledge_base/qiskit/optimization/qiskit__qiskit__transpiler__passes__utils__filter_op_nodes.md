---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/utils/filter_op_nodes.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/utils/filter_op_nodes.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/utils/filter_op_nodes.py`

Filter ops from a circuit

## `FilterOpNodes`

```python
class FilterOpNodes(TransformationPass)
```

Remove all operations that match a filter function

This transformation pass is used to remove any operations that matches a
the provided filter function.

Args:
   predicate: A given callable that will be passed the :class:`.DAGOpNode`
       for each node in the :class:`.DAGCircuit`. If the callable returns
       ``True`` the :class:`.DAGOpNode` is retained in the circuit and if it
       returns ``False`` it is removed from the circuit.

Example:

    Filter out operations that are labeled ``"foo"``

    .. plot::
       :alt: Circuit diagram output by the previous code.
       :include-source:

        from qiskit import QuantumCircuit
        from qiskit.transpiler.passes import FilterOpNodes

        circuit = QuantumCircuit(1)
        circuit.x(0, label='foo')
        circuit.barrier()
        circuit.h(0)

        circuit = FilterOpNodes(
            lambda node: getattr(node.op, "label") != "foo"
        )(circuit)
        circuit.draw('mpl')

### `run`

```python
def run(self, dag: DAGCircuit) -> DAGCircuit
```

Run the RemoveBarriers pass on `dag`.
