---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/clifford/clifford_decompose_bm.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/clifford/clifford_decompose_bm.py
license: Apache-2.0
---

## Module `qiskit/synthesis/clifford/clifford_decompose_bm.py`

Circuit synthesis for 2-qubit and 3-qubit Cliffords based on Bravyi & Maslov
decomposition.

## `synth_clifford_bm`

```python
def synth_clifford_bm(clifford: Clifford) -> QuantumCircuit
```

Optimal CX-cost decomposition of a :class:`.Clifford` operator on 2 qubits
or 3 qubits into a :class:`.QuantumCircuit` based on the Bravyi-Maslov method [1].

Args:
    clifford: A Clifford operator.

Returns:
    A circuit implementation of the Clifford.

Raises:
    QiskitError: if Clifford is on more than 3 qubits.

References:
    1. S. Bravyi, D. Maslov, *Hadamard-free circuits expose the
       structure of the Clifford group*,
       `arXiv:2003.09412 [quant-ph] <https://arxiv.org/abs/2003.09412>`_
