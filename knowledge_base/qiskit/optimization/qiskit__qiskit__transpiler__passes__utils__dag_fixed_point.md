---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/utils/dag_fixed_point.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/utils/dag_fixed_point.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/utils/dag_fixed_point.py`

Check if the DAG has reached a fixed point.

## `DAGFixedPoint`

```python
class DAGFixedPoint(AnalysisPass)
```

Check if the DAG has reached a fixed point.

A dummy analysis pass that checks if the DAG reached a fixed point (the DAG is not
modified anymore). The result is saved in
``property_set['dag_fixed_point']`` as a boolean.

### `run`

```python
def run(self, dag: DAGCircuit) -> None
```

Run the DAGFixedPoint pass on ``dag``.
