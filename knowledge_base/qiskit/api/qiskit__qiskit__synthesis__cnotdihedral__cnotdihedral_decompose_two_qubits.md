---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/cnotdihedral/cnotdihedral_decompose_two_qubits.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/cnotdihedral/cnotdihedral_decompose_two_qubits.py
license: Apache-2.0
---

## Module `qiskit/synthesis/cnotdihedral/cnotdihedral_decompose_two_qubits.py`

Circuit synthesis for the CNOTDihedral class.

## `synth_cnotdihedral_two_qubits`

```python
def synth_cnotdihedral_two_qubits(elem: CNOTDihedral) -> QuantumCircuit
```

Decompose a :class:`.CNOTDihedral` element on a single qubit and two
qubits into a :class:`.QuantumCircuit`.
This decomposition has an optimal number of :class:`.CXGate`\ s.

Args:
    elem: A :class:`.CNOTDihedral` element.

Returns:
    A circuit implementation of the :class:`.CNOTDihedral` element.

Raises:
    QiskitError: if the element is not 1-qubit or 2-qubit :class:`.CNOTDihedral`.

References:
    1. Shelly Garion and Andrew W. Cross, *On the structure of the CNOT-Dihedral group*,
       `arXiv:2006.12042 [quant-ph] <https://arxiv.org/abs/2006.12042>`_
