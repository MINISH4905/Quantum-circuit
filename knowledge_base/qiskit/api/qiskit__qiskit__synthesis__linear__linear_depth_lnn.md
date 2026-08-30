---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/linear/linear_depth_lnn.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/linear/linear_depth_lnn.py
license: Apache-2.0
---

## Module `qiskit/synthesis/linear/linear_depth_lnn.py`

Optimize the synthesis of an n-qubit circuit containing only CX gates for
linear nearest neighbor (LNN) connectivity.
The depth of the circuit is bounded by 5*n, while the gate count is approximately 2.5*n^2

References:
    [1]: Kutin, S., Moulton, D. P., Smithline, L. (2007).
         Computation at a Distance.
         `arXiv:quant-ph/0701194 <https://arxiv.org/abs/quant-ph/0701194>`_.

## `synth_cnot_depth_line_kms`

```python
def synth_cnot_depth_line_kms(mat: np.ndarray[bool]) -> QuantumCircuit
```

Synthesize linear reversible circuit for linear nearest-neighbor architectures using
Kutin, Moulton, Smithline method.

Synthesis algorithm for linear reversible circuits from [1], section 7.
This algorithm synthesizes any linear reversible circuit of :math:`n` qubits over
a linear nearest-neighbor architecture using CX gates with depth at most :math:`5n`.

Args:
    mat: A boolean invertible matrix.

Returns:
    The synthesized quantum circuit.

Raises:
    QiskitError: if ``mat`` is not invertible.

References:
    1. Kutin, S., Moulton, D. P., Smithline, L.,
       *Computation at a distance*, Chicago J. Theor. Comput. Sci., vol. 2007, (2007),
       `arXiv:quant-ph/0701194 <https://arxiv.org/abs/quant-ph/0701194>`_
