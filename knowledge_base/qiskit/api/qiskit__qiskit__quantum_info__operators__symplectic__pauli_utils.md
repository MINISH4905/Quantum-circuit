---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/symplectic/pauli_utils.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/symplectic/pauli_utils.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/symplectic/pauli_utils.py`

PauliList utility functions.

## `pauli_basis`

```python
def pauli_basis(num_qubits: int, weight: bool=False) -> PauliList
```

Return the ordered PauliList for the n-qubit Pauli basis.

Args:
    num_qubits (int): number of qubits
    weight (bool): if True optionally return the basis sorted by Pauli weight
                   rather than lexicographic order (Default: False)

Returns:
    PauliList: the Paulis for the basis
