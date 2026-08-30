---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/value/measurement_key.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/value/measurement_key.py
license: Apache-2.0
---

## `MeasurementKey`

```python
class MeasurementKey
```

A class representing a Measurement Key.

Wraps a string key. If you just want the string measurement key, simply call `str()` on this.

Args:
    name: The string representation of the key.
    path: The path to this key in a circuit. In a multi-level circuit (one with repeated or
        nested subcircuits), we need to differentiate the keys that occur multiple times. The
        path is used to create such fully qualified unique measurement key based on where it
        occurs in the circuit. The path is outside-to-in, the outermost subcircuit identifier
        appears first in the tuple.

### `replace`

```python
def replace(self, **changes) -> MeasurementKey
```

Returns a copy of this MeasurementKey with the specified changes.

### `parse_serialized`

```python
def parse_serialized(cls, key_str: str) -> MeasurementKey
```

Parses the serialized string representation of `Measurementkey` into a `MeasurementKey`.

This is the only way to construct a `MeasurementKey` from a nested string representation
(where the path is joined to the key name by the `MEASUREMENT_KEY_SEPARATOR`)

### `with_key_path_prefix`

```python
def with_key_path_prefix(self, *path_component: str)
```

Adds the input path component to the start of the path.

Useful when constructing the path from inside to out (in case of nested subcircuits),
recursively.
