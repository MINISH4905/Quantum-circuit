---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/mixins/multiply.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/mixins/multiply.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/mixins/multiply.py`

Mixin for operator scalar multiplication interface.

## `MultiplyMixin`

```python
class MultiplyMixin(ABC)
```

Abstract Mixin for scalar multiplication.

This class defines the following operator overloads:

    - ``*`` / ``__rmul__`
    - ``/`` / ``__truediv__``
    - ``__neg__``

The following abstract methods must be implemented by subclasses
using this mixin

    - ``_multiply(self, other)``
