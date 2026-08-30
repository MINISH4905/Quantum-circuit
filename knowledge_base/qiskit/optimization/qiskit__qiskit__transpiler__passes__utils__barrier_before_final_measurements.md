---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/utils/barrier_before_final_measurements.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/utils/barrier_before_final_measurements.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/utils/barrier_before_final_measurements.py`

Add a barrier before final measurements.

## `BarrierBeforeFinalMeasurements`

```python
class BarrierBeforeFinalMeasurements(TransformationPass)
```

Add a barrier before final measurements.

This pass adds a barrier before the set of final measurements. Measurements
are considered final if they are followed by no other operations (aside from
other measurements or barriers.)

### `run`

```python
def run(self, dag)
```

Run the BarrierBeforeFinalMeasurements pass on `dag`.
