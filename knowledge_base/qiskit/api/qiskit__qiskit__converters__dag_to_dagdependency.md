---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/converters/dag_to_dagdependency.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/converters/dag_to_dagdependency.py
license: Apache-2.0
---

## Module `qiskit/converters/dag_to_dagdependency.py`

Helper function for converting a dag circuit to a dag dependency

## `dag_to_dagdependency`

```python
def dag_to_dagdependency(dag, create_preds_and_succs=True)
```

Build a ``DAGDependency`` object from a ``DAGCircuit``.

Args:
    dag (DAGCircuit): the input dag.
    create_preds_and_succs (bool): whether to construct lists of
        predecessors and successors for every node.

Return:
    DAGDependency: the DAG representing the input circuit as a dag dependency.
