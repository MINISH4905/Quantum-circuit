---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/value/condition.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/value/condition.py
license: Apache-2.0
---

## `Condition`

```python
class Condition(abc.ABC)
```

A classical control condition that can gate an operation.

### `keys`

```python
def keys(self) -> tuple[cirq.MeasurementKey, ...]
```

Gets the control keys.

### `replace_key`

```python
def replace_key(self, current: cirq.MeasurementKey, replacement: cirq.MeasurementKey)
```

Replaces the control keys.

### `resolve`

```python
def resolve(self, classical_data: cirq.ClassicalDataStoreReader) -> bool
```

Resolves the condition based on the measurements.

### `qasm`

```python
def qasm(self)
```

Returns the qasm of this condition.

## `KeyCondition`

```python
class KeyCondition(Condition)
```

A classical control condition based on a single measurement key.

This condition resolves to True iff the measurement key is non-zero at the
time of resolution.

## `BitMaskKeyCondition`

```python
class BitMaskKeyCondition(Condition)
```

A multiqubit classical control condition with a bitmask.

The control is based on a single measurement key and allows comparing equality or inequality
after taking the bitwise and with a bitmask.

Examples:
    - BitMaskKeyCondition('a') -> a != 0
    - BitMaskKeyCondition('a', bitmask=13) -> (a & 13) != 0
    - BitMaskKeyCondition('a', bitmask=13, target_value=9) -> (a & 13) != 9
    - BitMaskKeyCondition('a', bitmask=13, target_value=9, equal_target=True) -> (a & 13) == 9
    - BitMaskKeyCondition.create_equal_mask('a', 13) -> (a & 13) == 13
    - BitMaskKeyCondition.create_not_equal_mask('a', 13) -> (a & 13) != 13

The bits in the bitmask have the same order as the qubits passed to `cirq.measure(...)`. That's
the most significant bit corresponds to the first (left most) qubit.

Attributes:
    - key: Measurement key.
    - index: integer index (same as KeyCondition.index).
    - target_value: The value we compare with.
    - equal_target: Whether to comapre with == or !=.
    - bitmask: Optional bitmask to apply before doing the comparison.

### `create_equal_mask`

```python
def create_equal_mask(key: cirq.MeasurementKey, bitmask: int, *, index: int=-1) -> BitMaskKeyCondition
```

Creates a condition that evaluates (meas & bitmask) == bitmask.

### `create_not_equal_mask`

```python
def create_not_equal_mask(key: cirq.MeasurementKey, bitmask: int, *, index: int=-1) -> BitMaskKeyCondition
```

Creates a condition that evaluates (meas & bitmask) != bitmask.

## `SympyCondition`

```python
class SympyCondition(Condition)
```

A classical control condition based on a sympy expression.

This condition resolves to True iff the sympy expression resolves to a
truthy value (i.e. `bool(x) == True`) when the measurement keys are
substituted in as the free variables.

`sympy.IndexedBase` can be used for bitwise conditions. For example, the
following will create a condition that is controlled by the XOR of the
first two bits (big-endian) of measurement 'a'.
>>> a = sympy.IndexedBase('a')
>>> cond = cirq.SympyCondition(sympy.Xor(a[0], a[1]))
