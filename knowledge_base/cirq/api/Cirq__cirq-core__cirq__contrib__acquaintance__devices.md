---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/acquaintance/devices.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/acquaintance/devices.py
license: Apache-2.0
---

## `AcquaintanceDevice`

```python
class AcquaintanceDevice(devices.Device, metaclass=abc.ABCMeta)
```

A device that contains only acquaintance and permutation gates.

## `get_acquaintance_size`

```python
def get_acquaintance_size(obj: circuits.Circuit | ops.Operation) -> int
```

The maximum number of qubits to be acquainted with each other.
