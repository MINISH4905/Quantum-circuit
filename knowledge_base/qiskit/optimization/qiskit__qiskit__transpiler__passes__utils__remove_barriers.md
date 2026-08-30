---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/utils/remove_barriers.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/utils/remove_barriers.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/utils/remove_barriers.py`

Remove all barriers in a circuit

## `RemoveBarriers`

```python
class RemoveBarriers(TransformationPass)
```

Return a circuit with any barrier removed.

This transformation is not semantics preserving.

Example:

    .. plot::
       :alt: Circuit diagram output by the previous code.
       :include-source:

        from qiskit import QuantumCircuit
        from qiskit.transpiler.passes import RemoveBarriers

        circuit = QuantumCircuit(1)
        circuit.x(0)
        circuit.barrier()
        circuit.h(0)

        circuit = RemoveBarriers()(circuit)
        circuit.draw('mpl')

### `run`

```python
def run(self, dag: DAGCircuit) -> DAGCircuit
```

Run the RemoveBarriers pass on `dag`.
