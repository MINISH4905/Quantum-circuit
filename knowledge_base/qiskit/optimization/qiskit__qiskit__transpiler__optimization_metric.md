---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/optimization_metric.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/optimization_metric.py
license: Apache-2.0
---

## Module `qiskit/transpiler/optimization_metric.py`

Enumeration of optimization metrics.

## `OptimizationMetric`

```python
class OptimizationMetric(enum.Enum)
```

Optimization metric considered during transpilation.

The metric :data:`COUNT_2Q` targets optimizing the two-qubit gate count of
the output circuit.  This is generally the preferred choice for
near-term execution.

The metric :data:`COUNT_T` targets optimizing the T-count of the output circuit
when the circuit is transpiled into the Clifford+T basis set.
