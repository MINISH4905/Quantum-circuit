---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/reset_after_measure_simplification.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/reset_after_measure_simplification.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/reset_after_measure_simplification.py`

Replace resets after measure with a conditional XGate.

## `ResetAfterMeasureSimplification`

```python
class ResetAfterMeasureSimplification(TransformationPass)
```

This pass replaces reset after measure with a conditional X gate.

This optimization is suitable for use on IBM Quantum systems where the
reset operation is performed by a measurement followed by a conditional
x-gate. It might not be desirable on other backends if reset is implemented
differently.

### `run`

```python
def run(self, dag)
```

Run the pass on a dag.
