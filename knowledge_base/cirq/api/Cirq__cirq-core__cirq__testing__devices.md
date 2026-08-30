---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/devices.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/devices.py
license: Apache-2.0
---

## Module `cirq-core/cirq/testing/devices.py`

Provides test devices that can validate circuits.

## `ValidatingTestDevice`

```python
class ValidatingTestDevice(devices.Device)
```

A fake device that was created to ensure certain Device validation features are
leveraged in Circuit functions. It contains the minimum set of features that tests
require. Feel free to extend the features here as needed.

Args:
    qubits: set of qubits on this device
    name: the name for repr
    allowed_gates: tuple of allowed gate types
    allowed_qubit_types: tuple of allowed qubit types
    validate_locality: if True, device will validate 2 qubit operations
        (except MeasurementGateOperations) whether the two qubits are adjacent. If True,
        GridQubits are assumed to be part of the allowed_qubit_types
    auto_decompose_gates: when set, for given gates it calls the cirq.decompose protocol
