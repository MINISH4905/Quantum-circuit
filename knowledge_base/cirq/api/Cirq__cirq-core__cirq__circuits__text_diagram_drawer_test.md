---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/circuits/text_diagram_drawer_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/circuits/text_diagram_drawer_test.py
license: Apache-2.0
---

## `assert_has_rendering`

```python
def assert_has_rendering(actual: TextDiagramDrawer, desired: str, **kwargs) -> None
```

Determines if a given diagram has the desired rendering.

Args:
    actual: The text diagram.
    desired: The desired rendering as a string.
    **kwargs: Keyword arguments to be passed to actual.render.
