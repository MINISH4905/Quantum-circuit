---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/converters/circuit_to_dagdependency.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/converters/circuit_to_dagdependency.py
license: Apache-2.0
---

## Module `qiskit/converters/circuit_to_dagdependency.py`

Helper function for converting a circuit to a dag dependency

## `circuit_to_dagdependency`

```python
def circuit_to_dagdependency(circuit, create_preds_and_succs=True)
```

Build a ``DAGDependency`` object from a :class:`~.QuantumCircuit`.

Args:
    circuit (QuantumCircuit): the input circuit.
    create_preds_and_succs (bool): whether to construct lists of
        predecessors and successors for every node.

Return:
    DAGDependency: the DAG representing the input circuit as a dag dependency.
