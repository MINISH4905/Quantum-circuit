---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/value/timestamp.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/value/timestamp.py
license: Apache-2.0
---

## Module `cirq-core/cirq/value/timestamp.py`

A typed location in time that supports picosecond accuracy.

## `Timestamp`

```python
class Timestamp
```

A location in time with picosecond accuracy.

Supports affine operations against Duration.

### `__init__`

```python
def __init__(self, *, picos: float=0, nanos: float=0) -> None
```

Initializes a Timestamp with a time specified in ns and/or ps.

The time is relative to some unspecified "time zero". If both picos and
nanos are specified, their contributions away from zero are added.

Args:
    picos: How many picoseconds away from time zero?
    nanos: How many nanoseconds away from time zero?

### `raw_picos`

```python
def raw_picos(self) -> float
```

The timestamp's location in picoseconds from arbitrary time zero.
