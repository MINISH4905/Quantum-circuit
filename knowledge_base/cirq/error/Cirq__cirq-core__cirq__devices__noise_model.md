---
framework: cirq
api_version: v1.7.0
doc_type: error
source_path: cirq-core/cirq/devices/noise_model.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/devices/noise_model.py
license: Apache-2.0
---

## Error surface of `cirq-core/cirq/devices/noise_model.py`

### Validation

## `validate_all_measurements`

```python
def validate_all_measurements(moment: cirq.Moment) -> bool
```

Ensures that the moment is homogenous and returns whether all ops are measurement gates.

Args:
    moment: the moment to be checked
Returns:
    bool: True if all operations are measurements, False if none of them are
Raises:
    ValueError: If a moment is a mixture of measurement and non-measurement gates.
