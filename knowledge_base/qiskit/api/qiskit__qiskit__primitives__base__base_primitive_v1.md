---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/base/base_primitive_v1.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/base/base_primitive_v1.py
license: Apache-2.0
---

## Module `qiskit/primitives/base/base_primitive_v1.py`

Primitive V1 abstract base class.

## `BasePrimitiveV1`

```python
class BasePrimitiveV1(ABC)
```

Primitive V1 abstract base class.

### `options`

```python
def options(self) -> Options
```

Return options values for the estimator.

Returns:
    options

### `set_options`

```python
def set_options(self, **fields)
```

Set options values for the estimator.

Args:
    **fields: The fields to update the options
