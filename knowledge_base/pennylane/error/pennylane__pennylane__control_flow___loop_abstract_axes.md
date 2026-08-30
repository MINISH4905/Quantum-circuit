---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/control_flow/_loop_abstract_axes.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/control_flow/_loop_abstract_axes.py
license: Apache-2.0
---

## Error surface of `pennylane/control_flow/_loop_abstract_axes.py`

### Validation

## `validate_no_resizing_returns`

```python
def validate_no_resizing_returns(jaxpr: 'jax.extend.core.Jaxpr', locations: list[list[AbstractShapeLocation]], name: str='while_loop') -> str | None
```

Validate that all jaxpr outputs that should have the same shape as specified in ``locations``
continue to have the same shape.  Returns a string with an error message so we can
either decide to raise the error, or try again with different settings.
