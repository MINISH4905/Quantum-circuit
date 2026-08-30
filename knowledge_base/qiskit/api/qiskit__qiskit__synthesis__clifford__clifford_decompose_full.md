---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/clifford/clifford_decompose_full.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/clifford/clifford_decompose_full.py
license: Apache-2.0
---

## Module `qiskit/synthesis/clifford/clifford_decompose_full.py`

Circuit synthesis for the Clifford class for all-to-all architecture.

## `synth_clifford_full`

```python
def synth_clifford_full(clifford: Clifford, method: str | None=None) -> QuantumCircuit
```

Decompose a :class:`.Clifford` operator into a :class:`.QuantumCircuit`.

For :math:`N \leq 3` qubits this is based on optimal CX-cost decomposition
from reference [1]. For :math:`N > 3` qubits this is done using the general
non-optimal greedy compilation routine from reference [3],
which typically yields better CX cost compared to the AG method in [2].

Args:
    clifford: A Clifford operator.
    method:  a synthesis method (``'AG'`` or ``'greedy'``).
         If set this overrides optimal decomposition for :math:`N \leq 3` qubits.

Returns:
    A circuit implementation of the Clifford.

References:
    1. S. Bravyi, D. Maslov, *Hadamard-free circuits expose the
       structure of the Clifford group*,
       `arXiv:2003.09412 [quant-ph] <https://arxiv.org/abs/2003.09412>`_

    2. S. Aaronson, D. Gottesman, *Improved Simulation of Stabilizer Circuits*,
       Phys. Rev. A 70, 052328 (2004).
       `arXiv:quant-ph/0406196 <https://arxiv.org/abs/quant-ph/0406196>`_

    3. Sergey Bravyi, Shaohan Hu, Dmitri Maslov, Ruslan Shaydulin,
       *Clifford Circuit Optimization with Templates and Symbolic Pauli Gates*,
       `arXiv:2105.02291 [quant-ph] <https://arxiv.org/abs/2105.02291>`_
