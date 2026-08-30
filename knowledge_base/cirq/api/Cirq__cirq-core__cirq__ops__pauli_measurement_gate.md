---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/pauli_measurement_gate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/pauli_measurement_gate.py
license: Apache-2.0
---

## `PauliMeasurementGate`

```python
class PauliMeasurementGate(raw_types.Gate)
```

A gate that measures a Pauli observable.

PauliMeasurementGate contains a key used to identify results of measurement
and a list of Paulis which denote the observable to be measured.

### `__init__`

```python
def __init__(self, observable: cirq.BaseDensePauliString | Iterable[cirq.Pauli], key: str | cirq.MeasurementKey='') -> None
```

Inits PauliMeasurementGate.

Args:
    observable: Pauli observable to measure. Any `Iterable[cirq.Pauli]`
        is a valid Pauli observable (with a +1 coefficient by default).
        If you wish to measure pauli observables with coefficient -1,
        then pass a `cirq.DensePauliString` as observable.
    key: The string key of the measurement.

Raises:
    ValueError: If the observable is empty.

### `with_key`

```python
def with_key(self, key: str | cirq.MeasurementKey) -> PauliMeasurementGate
```

Creates a pauli measurement gate with a new key but otherwise identical.

### `with_observable`

```python
def with_observable(self, observable: cirq.BaseDensePauliString | Iterable[cirq.Pauli]) -> PauliMeasurementGate
```

Creates a pauli measurement gate with the new observable and same key.

### `observable`

```python
def observable(self) -> cirq.DensePauliString
```

Pauli observable which should be measured by the gate.
