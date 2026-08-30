---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/analysis/dag_longest_path.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/analysis/dag_longest_path.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/analysis/dag_longest_path.py`

Return the longest path in a :class:`.DAGCircuit` as a list of DAGNodes.

## `DAGLongestPath`

```python
class DAGLongestPath(AnalysisPass)
```

Return the longest path in a :class:`.DAGCircuit` as a list of
:class:`.DAGOpNode`\ s, :class:`.DAGInNode`\ s, and :class:`.DAGOutNode`\ s.

### `run`

```python
def run(self, dag: DAGCircuit) -> None
```

Run the DAGLongestPath pass on ``dag``.
