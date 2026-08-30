---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/mixed_unitary_channel.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/mixed_unitary_channel.py
license: Apache-2.0
---

## `MixedUnitaryChannel`

```python
class MixedUnitaryChannel(raw_types.Gate)
```

A generic mixture that can record the index of its selected operator.

This type of object is also referred to as a mixed-unitary channel.

Args:
    mixture: a list of (probability, qubit unitary) pairs
    key: an optional measurement key string for this mixture. Simulations
        which select a single unitary to apply will store the index
        of that unitary in the measurement result list with this key.
    validate: if True, validate that `mixture` describes a valid mixture.
        This validation can be slow; prefer pre-validating if possible.

### `from_mixture`

```python
def from_mixture(mixture: protocols.SupportsMixture, key: str | cirq.MeasurementKey | None=None)
```

Creates a copy of a mixture with the given measurement key.
