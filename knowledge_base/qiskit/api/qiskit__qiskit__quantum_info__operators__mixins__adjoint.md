---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/mixins/adjoint.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/mixins/adjoint.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/mixins/adjoint.py`

Mixin for gate operator interface.

## `AdjointMixin`

```python
class AdjointMixin(ABC)
```

Abstract Mixin for operator adjoint and transpose operations.

This class defines the following methods

    - :meth:`transpose`
    - :meth:`conjugate`
    - :meth:`adjoint`

The following abstract methods must be implemented by subclasses
using this mixin

    - ``conjugate(self)``
    - ``transpose(self)``

### `adjoint`

```python
def adjoint(self) -> Self
```

Return the adjoint of the CLASS.

### `conjugate`

```python
def conjugate(self) -> Self
```

Return the conjugate of the CLASS.

### `transpose`

```python
def transpose(self) -> Self
```

Return the transpose of the CLASS.
