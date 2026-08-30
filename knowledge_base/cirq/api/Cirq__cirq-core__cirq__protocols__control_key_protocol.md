---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/control_key_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/control_key_protocol.py
license: Apache-2.0
---

## Module `cirq-core/cirq/protocols/control_key_protocol.py`

Protocol for object that have control keys.

## `SupportsControlKey`

```python
class SupportsControlKey(Protocol)
```

An object that is a has a classical control key or keys.

Control keys are used in referencing the results of a measurement.

Users should implement `_control_keys_` returning an iterable of
`MeasurementKey`.

## `control_keys`

```python
def control_keys(val: Any) -> frozenset[cirq.MeasurementKey]
```

Gets the keys that the value is classically controlled by.

Args:
    val: The object that may be classically controlled.

Returns:
    The measurement keys the value is controlled by. If the value is not
    classically controlled, the result is the empty tuple.

Notes:
    For composite operations (e.g. CircuitOperation), only control keys that
    have not already been measured earlier in the subcircuit are returned.
    Control keys that are satisfied by measurements **after** their use in
    the subcircuit are still required externally and thus appear in the
    result.

## `measurement_keys_touched`

```python
def measurement_keys_touched(val: Any) -> frozenset[cirq.MeasurementKey]
```

Returns all the measurement keys used by the value.

This would be the case if the value is or contains a measurement gate, or
if the value is or contains a conditional operation.

Args:
    val: The object that may interact with measurements.

Returns:
    The measurement keys used by the value..
