---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/has_unitary_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/has_unitary_protocol.py
license: Apache-2.0
---

## `SupportsExplicitHasUnitary`

```python
class SupportsExplicitHasUnitary(Protocol)
```

An object that explicitly specifies whether it has a unitary effect.

## `has_unitary`

```python
def has_unitary(val: Any, *, allow_decompose: bool=True) -> bool
```

Determines whether the value has a unitary effect.

Determines whether `val` has a unitary effect by attempting the following
strategies:

1. Try to use `val.has_unitary()`.
    Case a) Method not present or returns `NotImplemented`.
        Inconclusive.
    Case b) Method returns `True`.
        Unitary.
    Case c) Method returns `False`.
        Not unitary.

2. Try to use `val._decompose_()`.
    Case a) Method not present or returns `NotImplemented` or `None`.
        Inconclusive.
    Case b) Method returns an OP_TREE containing only unitary operations.
        Unitary.
    Case c) Method returns an OP_TREE containing non-unitary operations.
        Not Unitary.

3. Try to use `val._apply_unitary_(args)`.
    Case a) Method not present or returns `NotImplemented`.
        Inconclusive.
    Case b) Method returns a numpy array.
        Unitary.
    Case c) Method returns `None`.
        Not unitary.

4. Try to use `val._unitary_()`.
    Case a) Method not present or returns `NotImplemented`.
        Continue to next strategy.
    Case b) Method returns a numpy array.
        Unitary.
    Case c) Method returns `None`.
        Not unitary.

It is assumed that, when multiple of these strategies give a conclusive
result, that these results will all be consistent with each other. If all
strategies are inconclusive, the value is classified as non-unitary.

Args:
    The value that may or may not have a unitary effect.

Returns:
    Whether or not `val` has a unitary effect.
