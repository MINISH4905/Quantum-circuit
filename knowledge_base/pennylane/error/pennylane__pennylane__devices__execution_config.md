---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/devices/execution_config.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/execution_config.py
license: Apache-2.0
---

## Error surface of `pennylane/devices/execution_config.py`

### Validation

### `MCMConfig._validate_inputs`

```python
def _validate_inputs(self, mcm_method, postselect_mode) -> None
```

Validate inputs to MCMConfig.

Args:
    mcm_method (MCM_METHOD | str | None): Mid-circuit measurement method.
    postselect_mode (POSTSELECT_MODE | str | None): Postselection mode.
