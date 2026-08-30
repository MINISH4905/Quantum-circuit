---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/analysis/count_ops_longest_path.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/analysis/count_ops_longest_path.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/analysis/count_ops_longest_path.py`

Count the operations on the longest path in a DAGCircuit.

## `CountOpsLongestPath`

```python
class CountOpsLongestPath(AnalysisPass)
```

Count the operations on the longest path in a :class:`.DAGCircuit`.

The result is saved in ``property_set['count_ops_longest_path']`` as an integer.

### `run`

```python
def run(self, dag: DAGCircuit) -> None
```

Run the CountOpsLongestPath pass on ``dag``.
