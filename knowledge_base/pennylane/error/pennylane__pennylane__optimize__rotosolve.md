---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/optimize/rotosolve.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/optimize/rotosolve.py
license: Apache-2.0
---

## Error surface of `pennylane/optimize/rotosolve.py`

### Validation

## `_validate_inputs`

```python
def _validate_inputs(requires_grad, args, nums_frequency, spectra)
```

Checks that for each trainable argument either the number of
frequencies or the frequency spectrum is given.
