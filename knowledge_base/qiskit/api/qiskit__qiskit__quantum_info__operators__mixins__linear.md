---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/mixins/linear.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/mixins/linear.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/mixins/linear.py`

Mixin for linear operator interface.

## `LinearMixin`

```python
class LinearMixin(MultiplyMixin, ABC)
```

Abstract Mixin for linear operator.

This class defines the following operator overloads:

    - ``+`` / ``__add__``
    - ``-`` / ``__sub__``
    - ``*`` / ``__rmul__`
    - ``/`` / ``__truediv__``
    - ``__neg__``

The following abstract methods must be implemented by subclasses
using this mixin

    - ``_add(self, other, qargs=None)``
    - ``_multiply(self, other)``
