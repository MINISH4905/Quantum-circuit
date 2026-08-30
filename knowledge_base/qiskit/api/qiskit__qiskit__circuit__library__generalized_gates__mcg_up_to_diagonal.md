---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/generalized_gates/mcg_up_to_diagonal.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/generalized_gates/mcg_up_to_diagonal.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/generalized_gates/mcg_up_to_diagonal.py`

Multi controlled single-qubit unitary up to diagonal.

## `MCGupDiag`

```python
class MCGupDiag(Gate)
```

Decomposes a multi-controlled gate :math:`U` up to a diagonal :math:`D` acting on the control
and target qubit (but not on the ancilla qubits), i.e., it implements a circuit corresponding to
a unitary :math:`U'`, such that :math:`U = D U'`.

### `__init__`

```python
def __init__(self, gate: np.ndarray, num_controls: int, num_ancillas_zero: int, num_ancillas_dirty: int) -> None
```

Args:
    gate: :math:`2 \times 2` unitary given as a (complex) ``ndarray``.
    num_controls: Number of control qubits.
    num_ancillas_zero: Number of ancilla qubits that start in the state zero.
    num_ancillas_dirty: Number of ancilla qubits that are allowed to start in an
        arbitrary state.

Raises:
    QiskitError: if the input format is wrong; if the array gate is not unitary

### `inverse`

```python
def inverse(self, annotated: bool=False) -> Gate
```

Return the inverse.

Note that the resulting Gate object has an empty ``params`` property.

### `validate_parameter`

```python
def validate_parameter(self, parameter)
```

Multi controlled single-qubit unitary gate parameter has to be an ndarray.
