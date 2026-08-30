---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/mixins/__init__.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/mixins/__init__.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/mixins/__init__.py`

Operator Mixins

## `generate_apidocs`

```python
def generate_apidocs(cls)
```

Decorator to format API docstrings for classes using Mixins.

This runs string replacement on the docstrings of the mixin
methods to replace the placeholder CLASS with the class
name `cls.__name__`.

Args:
    cls (type): The class to format docstrings.

Returns:
    cls: the original class with updated docstrings.
