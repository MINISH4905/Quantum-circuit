---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/analysis/count_ops.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/analysis/count_ops.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/analysis/count_ops.py`

Count the operations in a DAG circuit.

## `CountOps`

```python
class CountOps(AnalysisPass)
```

Count the operations in a DAG circuit.

The result is saved in ``property_set['count_ops']`` as an integer.

### `__init__`

```python
def __init__(self, *, recurse: bool=True) -> None
```

Args:
    recurse: If ``True`` (default), recursively count operations
        inside control-flow blocks.

### `run`

```python
def run(self, dag: DAGCircuit) -> None
```

Run the CountOps pass on ``dag``.
