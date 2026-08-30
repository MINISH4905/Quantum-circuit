---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/kraus_channel.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/kraus_channel.py
license: Apache-2.0
---

## `KrausChannel`

```python
class KrausChannel(raw_types.Gate)
```

A generic channel that can record the index of its selected operator.

Args:
    kraus_ops: a list of Kraus operators, formatted as numpy array.
        Currently, only square-matrix operators on qubits (not qudits) are
        supported by this type.
    key: an optional measurement key string for this channel. Simulations
        which select a single Kraus operator to apply will store the index
        of that operator in the measurement result list with this key.
    validate: if True, validate that `kraus_ops` describe a valid channel.
        This validation can be slow; prefer pre-validating if possible.

### `from_channel`

```python
def from_channel(channel: cirq.Gate, key: str | cirq.MeasurementKey | None=None)
```

Creates a copy of a channel with the given measurement key.
