---
framework: cirq
api_version: v1.7.0
doc_type: error
source_path: cirq-core/cirq/ops/pauli_string.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/pauli_string.py
license: Apache-2.0
---

## Error surface of `cirq-core/cirq/ops/pauli_string.py`

### Validation

## `_validate_qubit_mapping`

```python
def _validate_qubit_mapping(qubit_map: Mapping[TKey, int], pauli_qubits: tuple[TKey, ...], num_state_qubits: int) -> None
```

Validates that a qubit map is a valid mapping.

This will enforce that all elements of `pauli_qubits` appear in `qubit_map`,
and that the integers in `qubit_map` correspond to valid positions in a
representation of a state over `num_state_qubits`.

Args:
    qubit_map: A map from qubits to integers.
    pauli_qubits: The qubits that must be contained in `qubit_map`.
    num_state_qubits: The number of qubits over which a state is expressed.

Raises:
    TypeError: If the qubit map is between the wrong types.
    ValueError: If the qubit maps is not complete or does not match with
        `num_state_qubits`.
