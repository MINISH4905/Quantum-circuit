---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/devices/capabilities.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/capabilities.py
license: Apache-2.0
---

## Error surface of `pennylane/devices/capabilities.py`

### Validation

## `_validate_conditions`

```python
def _validate_conditions(conditions: list[ExecutionCondition], target=None) -> None
```

Validates the execution conditions.

## `validate_mcm_method`

```python
def validate_mcm_method(capabilities: DeviceCapabilities | None, mcm_method: str | None, shots_present: bool)
```

Validates an MCM method against the device's capabilities.
