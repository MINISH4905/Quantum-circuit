---
framework: cirq
api_version: v1.7.0
doc_type: error
source_path: cirq-core/cirq/devices/thermal_noise_model.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/devices/thermal_noise_model.py
license: Apache-2.0
---

## Error surface of `cirq-core/cirq/devices/thermal_noise_model.py`

### Validation

## `_validate_rates`

```python
def _validate_rates(qubits: set[cirq.Qid], rates: dict[cirq.Qid, np.ndarray]) -> None
```

Check all rate matrices are square and of appropriate dimension.

We check rates are positive in the class validator.
