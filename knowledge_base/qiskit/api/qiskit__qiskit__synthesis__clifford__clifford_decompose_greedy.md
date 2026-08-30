---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/clifford/clifford_decompose_greedy.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/clifford/clifford_decompose_greedy.py
license: Apache-2.0
---

## Module `qiskit/synthesis/clifford/clifford_decompose_greedy.py`

Circuit synthesis for the Clifford class.

## `synth_clifford_greedy`

```python
def synth_clifford_greedy(clifford: Clifford) -> QuantumCircuit
```

Decompose a :class:`.Clifford` operator into a :class:`.QuantumCircuit` based
on the greedy Clifford compiler that is described in Appendix A of
Bravyi, Hu, Maslov and Shaydulin [1].

This method typically yields better CX cost compared to the Aaronson-Gottesman method.

Note that this function only implements the greedy Clifford compiler from Appendix A
of [1], and not the templates and symbolic Pauli gates optimizations
that are mentioned in the same paper.

Args:
    clifford: A Clifford operator.

Returns:
    A circuit implementation of the Clifford.

Raises:
    QiskitError: if symplectic Gaussian elimination fails.

References:
    1. Sergey Bravyi, Shaohan Hu, Dmitri Maslov, Ruslan Shaydulin,
       *Clifford Circuit Optimization with Templates and Symbolic Pauli Gates*,
       `arXiv:2105.02291 [quant-ph] <https://arxiv.org/abs/2105.02291>`_
