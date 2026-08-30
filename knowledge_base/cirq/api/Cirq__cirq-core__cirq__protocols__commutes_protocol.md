---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/commutes_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/commutes_protocol.py
license: Apache-2.0
---

## Module `cirq-core/cirq/protocols/commutes_protocol.py`

Protocol for determining commutativity.

## `SupportsCommutes`

```python
class SupportsCommutes(Protocol)
```

An object that can determine commutation relationships vs others.

## `commutes`

```python
def commutes(v1: Any, v2: Any, *, atol: float=1e-08, default: Any=RaiseTypeErrorIfNotProvided) -> Any
```

Determines whether two values commute.

This is determined by any one of the following techniques:

- Either value has a `_commutes_` method that returns 'True', 'False', or
    'None' (meaning indeterminate). If both methods either don't exist or
    return `NotImplemented` then another strategy is tried. `v1._commutes_`
    is tried before `v2._commutes_`.
- Both values are matrices. The return value is determined by checking if
    v1 @ v2 - v2 @ v1 is sufficiently close to zero.
- Both values are `cirq.Operation` instances. If the operations apply to
    disjoint qubit sets then they commute. Otherwise, if they have unitary
    matrices, those matrices are checked for commutativity (while accounting
    for the fact that the operations may have different qubit orders or only
    partially overlap).

If none of these techniques succeeds, the commutativity is assumed to be
indeterminate.

Args:
    v1: One of the values to check for commutativity. Can be a cirq object
        such as an operation, or a numpy matrix.
    v2: The other value to check for commutativity. Can be a cirq object
        such as an operation, or a numpy matrix.
    default: A fallback value to return, instead of raising a ValueError, if
        it is indeterminate whether or not the two values commute.
    atol: Absolute error tolerance. If all entries in v1@v2 - v2@v1 have a
        magnitude less than this tolerance, v1 and v2 can be reported as
        commuting. Defaults to 1e-8.

Returns:
    True: `v1` and `v2` commute (or approximately commute).
    False: `v1` and `v2` don't commute.
    default: The commutativity of `v1` and `v2` is indeterminate, or could
    not be determined, and the `default` argument was specified.

Raises:
    TypeError: The commutativity of `v1` and `v2` is indeterminate, or could
    not be determined, and the `default` argument was not specified.

## `definitely_commutes`

```python
def definitely_commutes(v1: Any, v2: Any, *, atol: float=1e-08) -> bool
```

Determines whether two values definitely commute.

Returns:
    True: The two values definitely commute.
    False: The two values may or may not commute.
