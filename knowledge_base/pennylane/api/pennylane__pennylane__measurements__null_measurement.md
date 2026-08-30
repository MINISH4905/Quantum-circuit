---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/measurements/null_measurement.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/measurements/null_measurement.py
license: Apache-2.0
---

## Module `pennylane/measurements/null_measurement.py`

This module contains the NullMeasurement class.

## `NullMeasurement`

```python
class NullMeasurement(SampleMeasurement, StateMeasurement)
```

A measurement that strictly returns an array with one nan.

This measurement is for profiling problems without the overhead of performing a measurement.

>>> @qp.qnode(qp.device('default.qubit', wires=1), diff_method="parameter-shift")
... def circuit():
...     return qp.measurements.NullMeasurement()
...
>>> circuit()
array(nan)

``np.array(np.nan)`` is chosen so the result still has a shape and data type for integration
with jax, catalyst, and program capture.
