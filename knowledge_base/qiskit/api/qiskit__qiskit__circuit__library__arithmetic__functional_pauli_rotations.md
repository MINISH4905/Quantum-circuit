---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/functional_pauli_rotations.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/functional_pauli_rotations.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/functional_pauli_rotations.py`

Base class for functional Pauli rotations.

## `FunctionalPauliRotations`

```python
class FunctionalPauliRotations(BlueprintCircuit, ABC)
```

Base class for functional Pauli rotations.

### `__init__`

```python
def __init__(self, num_state_qubits: int | None=None, basis: str='Y', name: str='F') -> None
```

Args:
    num_state_qubits: The number of qubits representing the state :math:`|x\rangle`.
    basis: The kind of Pauli rotation to use. Must be 'X', 'Y' or 'Z'.
    name: The name of the circuit object.

### `basis`

```python
def basis(self) -> str
```

The kind of Pauli rotation to be used.

Set the basis to 'X', 'Y' or 'Z' for controlled-X, -Y, or -Z rotations respectively.

Returns:
    The kind of Pauli rotation used in controlled rotation.

### `basis`

```python
def basis(self, basis: str) -> None
```

Set the kind of Pauli rotation to be used.

Args:
    basis: The Pauli rotation to be used.

Raises:
    ValueError: The provided basis is not X, Y or Z.

### `num_state_qubits`

```python
def num_state_qubits(self) -> int
```

The number of state qubits representing the state :math:`|x\rangle`.

Returns:
    The number of state qubits.

### `num_state_qubits`

```python
def num_state_qubits(self, num_state_qubits: int | None) -> None
```

Set the number of state qubits.

Note that this may change the underlying quantum register, if the number of state qubits
changes.

Args:
    num_state_qubits: The new number of qubits.

### `num_ancilla_qubits`

```python
def num_ancilla_qubits(self) -> int
```

The minimum number of ancilla qubits in the circuit.

Returns:
    The minimal number of ancillas required.
