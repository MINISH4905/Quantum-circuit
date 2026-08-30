---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/workflow/resolution.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/resolution.py
license: Apache-2.0
---

## Error surface of `pennylane/workflow/resolution.py`

### Validation

## `_validate_jax_version`

```python
def _validate_jax_version() -> None
```

Checks if the installed version of JAX is supported. If an unsupported version of
JAX is installed, a ``RuntimeWarning`` is raised.
