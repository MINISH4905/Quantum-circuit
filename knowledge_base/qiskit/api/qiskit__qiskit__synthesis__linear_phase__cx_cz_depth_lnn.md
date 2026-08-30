---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/linear_phase/cx_cz_depth_lnn.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/linear_phase/cx_cz_depth_lnn.py
license: Apache-2.0
---

## Module `qiskit/synthesis/linear_phase/cx_cz_depth_lnn.py`

Given -CZ-CX- transformation (a layer consisting only CNOT gates
    followed by a layer consisting only CZ gates)
Return a depth-5n circuit implementation of the -CZ-CX- transformation over LNN.

Args:
    mat_z: n*n symmetric binary matrix representing a -CZ- circuit
    mat_x: n*n invertible binary matrix representing a -CX- transformation

Output:
    QuantumCircuit: :class:`.QuantumCircuit` object containing a depth-5n circuit to implement -CZ-CX-

References:
    [1] S. A. Kutin, D. P. Moulton, and L. M. Smithline, "Computation at a distance," 2007.
    [2] D. Maslov and W. Yang, "CNOT circuits need little help to implement arbitrary
        Hadamard-free Clifford transformations they generate," 2022.

## `synth_cx_cz_depth_line_my`

```python
def synth_cx_cz_depth_line_my(mat_x: np.ndarray, mat_z: np.ndarray) -> QuantumCircuit
```

Joint synthesis of a -CZ-CX- circuit for linear nearest neighbor (LNN) connectivity,
with 2-qubit depth at most 5n, based on Maslov and Yang.
This method computes the CZ circuit inside the CX circuit via phase gate insertions.

Args:
    mat_z : a boolean symmetric matrix representing a CZ circuit.
        ``mat_z[i][j]=1`` represents a ``cz(i,j)`` gate

    mat_x : a boolean invertible matrix representing a CX circuit.

Returns:
    A circuit implementation of a CX circuit following a CZ circuit,
    denoted as a -CZ-CX- circuit,in two-qubit depth at most ``5n``, for LNN connectivity.

References:
    1. Kutin, S., Moulton, D. P., Smithline, L.,
       *Computation at a distance*, Chicago J. Theor. Comput. Sci., vol. 2007, (2007),
       `arXiv:quant-ph/0701194 <https://arxiv.org/abs/quant-ph/0701194>`_
    2. Dmitri Maslov, Willers Yang, *CNOT circuits need little help to implement arbitrary
       Hadamard-free Clifford transformations they generate*,
       `arXiv:2210.16195 <https://arxiv.org/abs/2210.16195>`_.
