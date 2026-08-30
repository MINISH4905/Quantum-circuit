---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/ftqc/conditional_measure.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ftqc/conditional_measure.py
license: Apache-2.0
---

## Error surface of `pennylane/ftqc/conditional_measure.py`

### Validation

## `_validate_measurements`

```python
def _validate_measurements(true_meas, false_meas)
```

Takes a pair of variables that are expected to be mid-circuit measurements
(representing a true and false functions for the conditional) and confirms that
they have the expected type, and 'match' except for the measurement basis
