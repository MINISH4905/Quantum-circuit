---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/vis/vis_utils.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/vis/vis_utils.py
license: Apache-2.0
---

## `relative_luminance`

```python
def relative_luminance(color: ArrayLike) -> float
```

Returns the relative luminance according to W3C specification.

Spec: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance.

Args:
    color: a numpy array with the first 3 elements red, green, and blue
        with values in [0, 1].
Returns:
    relative luminance of color in [0, 1].
