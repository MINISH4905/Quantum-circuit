---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/data/data_manager/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/data_manager/__init__.py
license: Apache-2.0
---

## Error surface of `pennylane/data/data_manager/__init__.py`

### Validation

## `_validate_attributes`

```python
def _validate_attributes(data_name: str, attributes: Iterable[str])
```

Checks that ``attributes`` contains only valid attributes for the given
``data_name``. If any attributes do not exist, raise a ValueError.
