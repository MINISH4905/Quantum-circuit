---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/permutation/permutation_reverse_lnn.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/permutation/permutation_reverse_lnn.py
license: Apache-2.0
---

## Module `qiskit/synthesis/permutation/permutation_reverse_lnn.py`

Synthesis of a reverse permutation for LNN connectivity.

## `synth_permutation_reverse_lnn_kms`

```python
def synth_permutation_reverse_lnn_kms(num_qubits: int) -> QuantumCircuit
```

Synthesize reverse permutation for linear nearest-neighbor architectures using
Kutin, Moulton, Smithline method.

Synthesis algorithm for reverse permutation from [1], section 5.
This algorithm synthesizes the reverse permutation on :math:`n` qubits over
a linear nearest-neighbor architecture using CX gates with depth :math:`2 * n + 2`.

Args:
    num_qubits: The number of qubits.

Returns:
    The synthesized quantum circuit.

References:
    1. Kutin, S., Moulton, D. P., Smithline, L.,
       *Computation at a distance*, Chicago J. Theor. Comput. Sci., vol. 2007, (2007),
       `arXiv:quant-ph/0701194 <https://arxiv.org/abs/quant-ph/0701194>`_
