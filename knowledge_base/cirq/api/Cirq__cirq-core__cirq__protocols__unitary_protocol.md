---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/unitary_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/unitary_protocol.py
license: Apache-2.0
---

## `SupportsUnitary`

```python
class SupportsUnitary(Protocol)
```

An object that may be describable by a unitary matrix.

## `unitary`

```python
def unitary(val: Any, default: np.ndarray | TDefault=RaiseTypeErrorIfNotProvided) -> np.ndarray | TDefault
```

Returns a unitary matrix describing the given value.

The matrix is determined by the first of these strategies that succeeds:

- If the value is a NumPy array, it is returned directly.
- The value has a `_unitary_` method that returns something besides `None` or
    `NotImplemented`. The matrix is whatever the method returned.
- The value has an `_apply_unitary_` method, and it returns something
    besides `None` or `NotImplemented`. The matrix is created by applying
    `_apply_unitary_` to an identity matrix.
- The value has a `_decompose_` method that returns a list of operations,
    and each operation in the list has a unitary effect. The matrix is
    created by aggregating the sub-operations' unitary effects.

If none of these techniques succeeds, it is assumed that `val` doesn't have
a unitary effect. The order in which techniques are attempted is
unspecified.

Args:
    val: The value to describe with a unitary matrix.
    default: Determines the fallback behavior when `val` doesn't have
        a unitary effect. If `default` is not set, a `TypeError` is raised.
        If `default` is set to a value, that value is returned.

Returns:
    If `val` has a unitary effect, the corresponding unitary matrix.
    Otherwise, if `default` is specified, it is returned.

Raises:
    TypeError: `val` doesn't have a unitary effect and no default value was
        specified.
