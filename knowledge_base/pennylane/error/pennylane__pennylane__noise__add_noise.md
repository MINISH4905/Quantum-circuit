---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/noise/add_noise.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/noise/add_noise.py
license: Apache-2.0
---

## Error surface of `pennylane/noise/add_noise.py`

### Validation

## `_validate_level`

```python
def _validate_level(level: str | int | slice) -> None
```

Check that the level specification is valid.

Args:
    level: The level specification from user input

Raises:
    ValueError: If the level is not recognized
