---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/linear_phase/cz_depth_lnn.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/linear_phase/cz_depth_lnn.py
license: Apache-2.0
---

## Module `qiskit/synthesis/linear_phase/cz_depth_lnn.py`

Synthesis of an n-qubit circuit containing only CZ gates for
linear nearest neighbor (LNN) connectivity, using CX and phase (S, Sdg or Z) gates.
The two-qubit depth of the circuit is bounded by 2*n+2.
This algorithm reverts the order of qubits.

References:
    [1]: Dmitri Maslov, Martin Roetteler,
         Shorter stabilizer circuits via Bruhat decomposition and quantum circuit transformations,
         `arXiv:1705.09176 <https://arxiv.org/abs/1705.09176>`_.

## `synth_cz_depth_line_mr`

```python
def synth_cz_depth_line_mr(mat: np.ndarray) -> QuantumCircuit
```

Synthesis of a CZ circuit for linear nearest neighbor (LNN) connectivity,
based on Maslov and Roetteler.

Note that this method *reverts* the order of qubits in the circuit,
and returns a circuit containing :class:`.CXGate`\s and phase gates
(:class:`.SGate`, :class:`.SdgGate` or :class:`.ZGate`).

Args:
    mat: a square upper-diagonal matrix of `bool` representing the CZ circuit.
        ``mat[i][j]=1 for i<j`` represents a ``cz(i,j)`` gate.  Only the upper triangle is read
        from; the diagonal and lower triangle have no effect.

Returns:
    A circuit implementation of the CZ circuit of depth :math:`2n+2` for LNN
    connectivity.

References:
    1. Dmitri Maslov, Martin Roetteler,
       *Shorter stabilizer circuits via Bruhat decomposition and quantum circuit transformations*,
       `arXiv:1705.09176 <https://arxiv.org/abs/1705.09176>`_.
