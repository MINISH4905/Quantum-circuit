---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/layout/enlarge_with_ancilla.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/layout/enlarge_with_ancilla.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/layout/enlarge_with_ancilla.py`

Extend the dag with virtual qubits that are in layout but not in the circuit yet.

## `EnlargeWithAncilla`

```python
class EnlargeWithAncilla(TransformationPass)
```

Extend the dag with virtual qubits that are in layout but not in the circuit yet.

Extend the DAG circuit with new virtual qubits (ancilla) that are specified
in the layout, but not present in the circuit. Which qubits to add are
previously allocated in the ``layout`` property, by a previous pass.

### `run`

```python
def run(self, dag)
```

Run the EnlargeWithAncilla pass on `dag`.

Args:
    dag (DAGCircuit): DAG to extend.

Returns:
    DAGCircuit: An extended DAG.

Raises:
    TranspilerError: If there is no layout in the property set or not set at init time.
