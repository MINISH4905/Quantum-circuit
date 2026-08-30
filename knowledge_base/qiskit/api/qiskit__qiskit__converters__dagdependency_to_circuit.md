---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/converters/dagdependency_to_circuit.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/converters/dagdependency_to_circuit.py
license: Apache-2.0
---

## Module `qiskit/converters/dagdependency_to_circuit.py`

Helper function for converting a dag dependency to a circuit

## `dagdependency_to_circuit`

```python
def dagdependency_to_circuit(dagdependency)
```

Build a ``QuantumCircuit`` object from a ``DAGDependency``.

Args:
    dagdependency (DAGDependency): the input dag.

Return:
    QuantumCircuit: the circuit representing the input dag dependency.
