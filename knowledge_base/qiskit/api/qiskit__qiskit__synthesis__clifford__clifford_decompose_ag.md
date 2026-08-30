---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/clifford/clifford_decompose_ag.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/clifford/clifford_decompose_ag.py
license: Apache-2.0
---

## Module `qiskit/synthesis/clifford/clifford_decompose_ag.py`

Circuit synthesis for the Clifford class.

## `synth_clifford_ag`

```python
def synth_clifford_ag(clifford: Clifford) -> QuantumCircuit
```

Decompose a :class:`.Clifford` operator into a :class:`.QuantumCircuit`
based on Aaronson-Gottesman method [1].

Args:
    clifford: A Clifford operator.

Returns:
    A circuit implementation of the Clifford.

References:
    1. S. Aaronson, D. Gottesman, *Improved Simulation of Stabilizer Circuits*,
       Phys. Rev. A 70, 052328 (2004).
       `arXiv:quant-ph/0406196 <https://arxiv.org/abs/quant-ph/0406196>`_
