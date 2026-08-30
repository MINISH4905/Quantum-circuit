---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/qid_shape_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/qid_shape_protocol.py
license: Apache-2.0
---

## `SupportsExplicitQidShape`

```python
class SupportsExplicitQidShape(Protocol)
```

A unitary, channel, mixture or other object that operates on a known
number qubits/qudits/qids, each with a specific number of quantum levels.

## `SupportsExplicitNumQubits`

```python
class SupportsExplicitNumQubits(Protocol)
```

A unitary, channel, mixture or other object that operates on a known
number of qubits.

## `qid_shape`

```python
def qid_shape(val: Any, default: TDefault=RaiseTypeErrorIfNotProvided) -> tuple[int, ...] | TDefault
```

Returns a tuple describing the number of quantum levels of each
qubit/qudit/qid `val` operates on.

Args:
    val: The value to get the shape of.
    default: Determines the fallback behavior when `val` doesn't have
        a shape. If `default` is not set, a TypeError is raised. If
        default is set to a value, that value is returned.

Returns:
    If `val` has a `_qid_shape_` method and its result is not
    NotImplemented, that result is returned. Otherwise, if `val` has a
    `_num_qubits_` method, the shape with `num_qubits` qubits is returned
    e.g. `(2,)*num_qubits`. If neither method returns a value other than
    NotImplemented and a default value was specified, the default value is
    returned.

Raises:
    TypeError: `val` doesn't have either a `_qid_shape_` or a `_num_qubits_`
        method (or they returned NotImplemented) and also no default value
        was specified.

## `num_qubits`

```python
def num_qubits(val: Any, default: TDefault=RaiseTypeErrorIfNotProvidedInt) -> int | TDefault
```

Returns the number of qubits, qudits, or qids `val` operates on.

Args:
    val: The value to get the number of qubits from.
    default: Determines the fallback behavior when `val` doesn't have
        a number of qubits. If `default` is not set, a TypeError is raised.
        If default is set to a value, that value is returned.

Returns:
    If `val` has a `_num_qubits_` method and its result is not
    NotImplemented, that result is returned. Otherwise, if `val` has a
    `_qid_shape_` method, the number of qubits is computed from the length
    of the shape and returned e.g. `len(shape)`. If neither method returns a
    value other than NotImplemented and a default value was specified, the
    default value is returned.

Raises:
    TypeError: `val` doesn't have either a `_num_qubits_` or a `_qid_shape_`
        method (or they returned NotImplemented) and also no default value
        was specified.
