---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/value/duration.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/value/duration.py
license: Apache-2.0
---

## Module `cirq-core/cirq/value/duration.py`

A typed time delta that supports picosecond accuracy.

## `Duration`

```python
class Duration
```

A time delta that supports symbols and picosecond accuracy.

### `__init__`

```python
def __init__(self, value: DURATION_LIKE | int=None, *, picos: _NUMERIC_INPUT_TYPE=0, nanos: _NUMERIC_INPUT_TYPE=0, micros: _NUMERIC_INPUT_TYPE=0, millis: _NUMERIC_INPUT_TYPE=0) -> None
```

Initializes a Duration with a time specified in some unit.

If multiple arguments are specified, their contributions are added.

Args:
    value: A value with a pre-specified time unit. Currently only
        supports 0 and `datetime.timedelta` instances.
    picos: A number of picoseconds to add to the time delta.
    nanos: A number of nanoseconds to add to the time delta.
    micros: A number of microseconds to add to the time delta.
    millis: A number of milliseconds to add to the time delta.

Raises:
    TypeError: If the given value is not of a `cirq.DURATION_LIKE` type.

Examples:
    >>> print(cirq.Duration(nanos=100))
    100 ns
    >>> print(cirq.Duration(micros=1.5 * sympy.Symbol('t')))
    (1500.0*t) ns

### `total_picos`

```python
def total_picos(self) -> _NUMERIC_OUTPUT_TYPE
```

Returns the number of picoseconds that the duration spans.

### `total_nanos`

```python
def total_nanos(self) -> _NUMERIC_OUTPUT_TYPE
```

Returns the number of nanoseconds that the duration spans.

### `total_micros`

```python
def total_micros(self) -> _NUMERIC_OUTPUT_TYPE
```

Returns the number of microseconds that the duration spans.

### `total_millis`

```python
def total_millis(self) -> _NUMERIC_OUTPUT_TYPE
```

Returns the number of milliseconds that the duration spans.
