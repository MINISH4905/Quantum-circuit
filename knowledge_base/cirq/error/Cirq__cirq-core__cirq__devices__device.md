---
framework: cirq
api_version: v1.7.0
doc_type: error
source_path: cirq-core/cirq/devices/device.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/devices/device.py
license: Apache-2.0
---

## Error surface of `cirq-core/cirq/devices/device.py`

### Validation

### `Device.validate_operation`

```python
def validate_operation(self, operation: cirq.Operation) -> None
```

Raises an exception if an operation is not valid.

Args:
    operation: The operation to validate.

Raises:
    ValueError: The operation isn't valid for this device.

### `Device.validate_circuit`

```python
def validate_circuit(self, circuit: cirq.AbstractCircuit) -> None
```

Raises an exception if a circuit is not valid.

Args:
    circuit: The circuit to validate.

Raises:
    ValueError: The circuit isn't valid for this device.

### `Device.validate_moment`

```python
def validate_moment(self, moment: cirq.Moment) -> None
```

Raises an exception if a moment is not valid.

Args:
    moment: The moment to validate.

Raises:
    ValueError: The moment isn't valid for this device.
