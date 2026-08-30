---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/gate_features.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/gate_features.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/gate_features.py`

Marker classes for indicating which additional features gates support.

For example: some gates are reversible, some have known matrices, etc.

## `InterchangeableQubitsGate`

```python
class InterchangeableQubitsGate(metaclass=abc.ABCMeta)
```

Indicates operations should be equal under some qubit permutations.

### `qubit_index_to_equivalence_group_key`

```python
def qubit_index_to_equivalence_group_key(self, index: int) -> int
```

Returns a key that differs between non-interchangeable qubits.
