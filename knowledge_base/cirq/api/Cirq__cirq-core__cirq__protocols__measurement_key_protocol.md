---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/measurement_key_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/measurement_key_protocol.py
license: Apache-2.0
---

## Module `cirq-core/cirq/protocols/measurement_key_protocol.py`

Protocol for object that have measurement keys.

## `SupportsMeasurementKey`

```python
class SupportsMeasurementKey(Protocol)
```

An object that is a measurement and has a measurement key or keys.

Measurement keys are used in referencing the results of a measurement.

Users are free to implement one of the following. Do not implement multiple
of these returning different values. The protocol behavior will be
unexpected in such a case.
1. `_measurement_key_objs_` returning an iterable of `MeasurementKey`s
2. `_measurement_key_obj_` returning one `MeasurementKey`
3. `_measurement_key_names_` returning an iterable of strings
4. `_measurement_key_name_` returning one string

Note: Measurements, in contrast to general quantum channels, are
distinguished by the recording of the quantum operation that occurred.
That is a general quantum channel may enact the evolution
    $$
    \rho \rightarrow \sum_k A_k \rho A_k^\dagger
    $$
where as a measurement enacts the evolution
    $$
    \rho \rightarrow A_k \rho A_k^\dagger
    $$
conditional on the measurement outcome being $k$.

## `measurement_key_obj`

```python
def measurement_key_obj(val, default=RaiseTypeErrorIfNotProvided)
```

Get the single measurement key object for the given value.

Args:
    val: The value which has one measurement key.
    default: Determines the fallback behavior when `val` doesn't have
        a measurement key. If `default` is not set, a TypeError is raised.
        If default is set to a value, that value is returned if the value
        does not have `_measurement_key_name_`.

Returns:
    If `val` has a `_measurement_key_obj[s]_` method and its result is not
    `NotImplemented`, that result is returned. Otherwise, if a default
    value was specified, the default value is returned.

Raises:
    TypeError: `val` doesn't have a _measurement_key_obj[s]_ method (or that method
        returned NotImplemented) and also no default value was specified.
    ValueError: `val` has multiple measurement keys.

## `measurement_key_name`

```python
def measurement_key_name(val, default=RaiseTypeErrorIfNotProvided)
```

Get the single measurement key for the given value.

Args:
    val: The value which has one measurement key.
    default: Determines the fallback behavior when `val` doesn't have
        a measurement key. If `default` is not set, a TypeError is raised.
        If default is set to a value, that value is returned if the value
        does not have `_measurement_key_name_`.

Returns:
    If `val` has a `_measurement_key_name_` method and its result is not
    `NotImplemented`, that result is returned. Otherwise, if a default
    value was specified, the default value is returned.

Raises:
    TypeError: `val` doesn't have a _measurement_key_name_ method (or that method
        returned NotImplemented) and also no default value was specified.
    ValueError: `val` has multiple measurement keys.

## `measurement_key_objs`

```python
def measurement_key_objs(val: Any) -> frozenset[cirq.MeasurementKey]
```

Gets the measurement key objects of measurements within the given value.

Args:
    val: The value which has the measurement key.

Returns:
    The measurement key objects of the value. If the value has no measurement,
    the result is the empty set.

## `measurement_key_names`

```python
def measurement_key_names(val: Any) -> frozenset[str]
```

Gets the measurement key strings of measurements within the given value.

Args:
    val: The value which has the measurement key.
    allow_decompose: Defaults to True. When true, composite operations that
        don't directly specify their measurement keys will be decomposed in
        order to find measurement keys within the decomposed operations. If
        not set, composite operations will appear to have no measurement
        keys. Used by internal methods to stop redundant decompositions from
        being performed.

Returns:
    The measurement keys of the value. If the value has no measurement,
    the result is the empty set.

## `is_measurement`

```python
def is_measurement(val: Any) -> bool
```

Determines whether or not the given value is a measurement (or contains one).

Measurements are identified by the fact that any of them may have an `_is_measurement_` method
or `cirq.measurement_keys` returns a non-empty result for them.

Args:
    val: The value which to evaluate.
    allow_decompose: Defaults to True. When true, composite operations that
        don't directly specify their `_is_measurement_` property will be decomposed in
        order to find any measurements keys within the decomposed operations.

## `with_measurement_key_mapping`

```python
def with_measurement_key_mapping(val: T, key_map: Mapping[str, str]) -> T
```

Remaps the target's measurement keys according to the provided key_map.

This method can be used to reassign measurement keys at runtime, or to
assign measurement keys from a higher-level object (such as a Circuit).

## `with_key_path`

```python
def with_key_path(val: T, path: tuple[str, ...]) -> T
```

Adds the path to the target's measurement keys.

The path usually refers to an identifier or a list of identifiers from a subcircuit that
used to contain the target. Since a subcircuit can be repeated and reused, these paths help
differentiate the actual measurement keys.

## `with_key_path_prefix`

```python
def with_key_path_prefix(val: T, prefix: tuple[str, ...]) -> T
```

Prefixes the path to the target's measurement keys.

The path usually refers to an identifier or a list of identifiers from a subcircuit that
used to contain the target. Since a subcircuit can be repeated and reused, these paths help
differentiate the actual measurement keys.

Args:
    val: The value whose path to prefix.
    prefix: The prefix to apply to the value's path.

## `with_rescoped_keys`

```python
def with_rescoped_keys(val: T, path: tuple[str, ...], bindable_keys: frozenset[cirq.MeasurementKey] | None=None) -> T
```

Rescopes any measurement and control keys to the provided path, given the existing keys.

The path usually refers to an identifier or a list of identifiers from a subcircuit that
used to contain the target. Since a subcircuit can be repeated and reused, these paths help
differentiate the actual measurement keys.

This function is generally for internal use in decomposing or iterating subcircuits.

Args:
    val: The value to rescope.
    path: The prefix to apply to the value's path.
    bindable_keys: The keys that can be bound to at the current scope.
