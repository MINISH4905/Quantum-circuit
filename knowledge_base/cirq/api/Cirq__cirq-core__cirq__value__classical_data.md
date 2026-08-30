---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/value/classical_data.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/value/classical_data.py
license: Apache-2.0
---

## `MeasurementType`

```python
class MeasurementType(enum.IntEnum)
```

Type of a measurement, whether a measurement or channel.

This determines how the results of a measurement are stored
as classical data in a `ClassicalDataStoreRegister`.
`MEASUREMENT` represent measurements of a `Cirq.Qid`
(for instance, a qubit or qudit).  A `CHANNEL` represents
the measurement of a channel, such as the set of Kraus
operators.  In this case, the data stored is the integer
index of the channel measured.

## `ClassicalDataDictionaryStore`

```python
class ClassicalDataDictionaryStore(ClassicalDataStore)
```

Classical data representing measurements and metadata.

### `__init__`

```python
def __init__(self, *, _records: dict[cirq.MeasurementKey, list[tuple[int, ...]]] | None=None, _measured_qubits: dict[cirq.MeasurementKey, list[tuple[cirq.Qid, ...]]] | None=None, _channel_records: dict[cirq.MeasurementKey, list[int]] | None=None, _measurement_types: dict[cirq.MeasurementKey, cirq.MeasurementType] | None=None)
```

Initializes a `ClassicalDataDictionaryStore` object.

### `records`

```python
def records(self) -> Mapping[cirq.MeasurementKey, list[tuple[int, ...]]]
```

Gets the a mapping from measurement key to measurement records.

### `channel_records`

```python
def channel_records(self) -> Mapping[cirq.MeasurementKey, list[int]]
```

Gets the a mapping from measurement key to channel measurement records.

### `measured_qubits`

```python
def measured_qubits(self) -> Mapping[cirq.MeasurementKey, list[tuple[cirq.Qid, ...]]]
```

Gets the a mapping from measurement key to the qubits measured.

### `measurement_types`

```python
def measurement_types(self) -> Mapping[cirq.MeasurementKey, cirq.MeasurementType]
```

Gets the a mapping from measurement key to the measurement type.
