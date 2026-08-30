---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/gradients/gradient_transform.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/gradients/gradient_transform.py
license: Apache-2.0
---

## Error surface of `pennylane/gradients/gradient_transform.py`

### Validation

## `_validate_gradient_methods`

```python
def _validate_gradient_methods(tape, method, diff_methods)
```

Validates if the gradient method requested is supported by the trainable
parameters of a tape, and returns the allowed parameter gradient methods.
