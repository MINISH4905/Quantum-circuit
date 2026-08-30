---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/analysis/resource_estimation.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/analysis/resource_estimation.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/analysis/resource_estimation.py`

Automatically require analysis passes for resource estimation.

## `ResourceEstimation`

```python
class ResourceEstimation(AnalysisPass)
```

Automatically require analysis passes for resource estimation.

An analysis pass for automatically running:

* Depth()
* Width()
* Size()
* CountOps()
* NumTensorFactors()
* NumQubits()

### `run`

```python
def run(self, dag: DAGCircuit) -> None
```

Run the ResourceEstimation pass on ``dag``.
