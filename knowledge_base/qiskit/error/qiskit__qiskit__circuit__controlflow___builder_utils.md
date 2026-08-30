---
framework: qiskit
api_version: 2.5.2
doc_type: error
source_path: qiskit/circuit/controlflow/_builder_utils.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/controlflow/_builder_utils.py
license: Apache-2.0
---

## Error surface of `qiskit/circuit/controlflow/_builder_utils.py`

### Validation

## `validate_condition`

```python
def validate_condition(condition: _ConditionT) -> _ConditionT
```

Validate that a condition is in a valid format and return it, but raise if it is invalid.

Args:
    condition: the condition to be tested for validity.  Must be either the legacy 2-tuple
        format, or a :class:`~.expr.Expr` that has `Bool` type.

Raises:
    CircuitError: if the condition is not in a valid format.

Returns:
    The same condition as passed, if it was valid.
