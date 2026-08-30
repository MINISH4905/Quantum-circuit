---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/discrete_basis/ross_selinger.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/discrete_basis/ross_selinger.py
license: Apache-2.0
---

## Module `qiskit/synthesis/discrete_basis/ross_selinger.py`

Synthesize a single-qubit gate using Ross-Selinger algorithm.

## `gridsynth_rz`

```python
def gridsynth_rz(angle: float, epsilon: float=1e-10) -> QuantumCircuit
```

Approximate RZ-rotation using the Ross-Selinger algorithm.

The algorithm is described in [1]. The source code (in Rust) is available at
https://github.com/qiskit-community/rsgridsynth.

Args:
    angle: Specifies the angle of the RZ-rotation.
    epsilon: The allowed approximation error.

Returns:
    A one-qubit circuit approximating ``RZ(angle)``.

References:

[1] Neil J. Ross, Peter Selinger, Optimal ancilla-free Clifford+T approximation of z-rotations,
    `arXiv:1403.2975 <https://arxiv.org/pdf/1403.2975>`_

## `gridsynth_unitary`

```python
def gridsynth_unitary(matrix: np.ndarray, epsilon: float=1e-10) -> QuantumCircuit
```

Approximate a 1-qubit unitary matrix using the Ross-Selinger algorithm.

The algorithm is described in [1]. The source code (in Rust) is available at
https://github.com/qiskit-community/rsgridsynth.

Args:
    matrix: A :math:`2      imes 2` unitary matrix.
    epsilon: The allowed approximation error.

Returns:
    A one-qubit circuit approximating ``matrix``.

References:

[1] Neil J. Ross, Peter Selinger, Optimal ancilla-free Clifford+T approximation of z-rotations,
    `arXiv:1403.2975 <https://arxiv.org/pdf/1403.2975>`_
