---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/optimize_swap_before_measure.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/optimize_swap_before_measure.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/optimize_swap_before_measure.py`

Remove the swaps followed by measurement (and adapt the measurement).

## `OptimizeSwapBeforeMeasure`

```python
class OptimizeSwapBeforeMeasure(TransformationPass)
```

Remove the swaps followed by measurement (and adapt the measurement).

Transpiler pass to remove swaps in front of measurements by re-targeting
the classical bit of the measure instruction.

### `run`

```python
def run(self, dag)
```

Run the OptimizeSwapBeforeMeasure pass on `dag`.

Args:
    dag (DAGCircuit): the DAG to be optimized.

Returns:
    DAGCircuit: the optimized DAG.
