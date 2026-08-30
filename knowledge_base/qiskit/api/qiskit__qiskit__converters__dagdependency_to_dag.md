---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/converters/dagdependency_to_dag.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/converters/dagdependency_to_dag.py
license: Apache-2.0
---

## Module `qiskit/converters/dagdependency_to_dag.py`

Helper function for converting a dag dependency to a dag circuit

## `dagdependency_to_dag`

```python
def dagdependency_to_dag(dagdependency)
```

Build a ``DAGCircuit`` object from a ``DAGDependency``.

Args:
    dagdependency (DAGDependency): the input dag.

Return:
    DAGCircuit: the DAG representing the input circuit.
