---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/labs/trotter_error/realspace/realspace_coefficients.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/trotter_error/realspace/realspace_coefficients.py
license: Apache-2.0
---

## Error surface of `pennylane/labs/trotter_error/realspace/realspace_coefficients.py`

### Validation

### `_RealspaceTree._validate_index`

```python
def _validate_index(self, index: tuple[int]) -> bool
```

Validate the shape of an index.

Args:
    index (Tuple[int]): an index

Returns:
    bool: True if ``index`` corresponds to a valid index of the tensor, False otherwise
