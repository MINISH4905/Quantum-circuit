---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/optimize_clifford_t.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/optimize_clifford_t.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/optimize_clifford_t.py`

Optimize sequences of single-qubit Clifford+T gates.

## `OptimizeCliffordT`

```python
class OptimizeCliffordT(TransformationPass)
```

Optimize sequences of consecutive Clifford+T gates.

This pass rewrites maximal chains of consecutive single-qubit
Clifford+T gates, reducing each chain to an equivalent sequence
that uses the minimum possible number of T gates.

For a chain of length :math:`m`, the pass runs in linear time,
:math:`O(m)`.

### `run`

```python
def run(self, dag: DAGCircuit)
```

Run the OptimizeCliffordT pass on `dag`.

Args:
    dag: The directed acyclic graph to run on.

Returns:
    DAGCircuit: Transformed DAG.
