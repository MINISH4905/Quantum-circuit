---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/generalized_gates/diagonal.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/generalized_gates/diagonal.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/generalized_gates/diagonal.py`

Diagonal matrix circuit.

## `Diagonal`

```python
class Diagonal(QuantumCircuit)
```

Circuit implementing a diagonal transformation.

### `__init__`

```python
def __init__(self, diag: Sequence[complex]) -> None
```

Args:
    diag: List of the :math:`2^k` diagonal entries (for a diagonal gate on :math:`k` qubits).

Raises:
    CircuitError: if the list of the diagonal entries or the qubit list is in bad format;
        if the number of diagonal entries is not :math:`2^k`, where :math:`k` denotes the
        number of qubits.

## `DiagonalGate`

```python
class DiagonalGate(Gate)
```

A generic diagonal quantum gate.

Matrix form:

.. math::
    \text{DiagonalGate}\ q_0, q_1, .., q_{n-1} =
        \begin{pmatrix}
            D[0]    & 0         & \dots     & 0 \\
            0       & D[1]      & \dots     & 0 \\
            \vdots  & \vdots    & \ddots    & 0 \\
            0       & 0         & \dots     & D[n-1]
        \end{pmatrix}

Diagonal gates are useful as representations of Boolean functions,
as they can map from :math:`\{0,1\}^{2^n}` to :math:`\{0,1\}^{2^n}` space. For example a phase
oracle can be seen as a diagonal gate with :math:`\{1, -1\}` on the diagonals. Such
an oracle will induce a :math:`+1` or :math`-1` phase on the amplitude of any corresponding
basis state.

Diagonal gates appear in many classically hard oracular problems such as
Forrelation or Hidden Shift circuits.

Diagonal gates are represented and simulated more efficiently than a dense
:math:`2^n \times 2^n` unitary matrix.

The reference implementation is via the method described in
Theorem 7 of [1]. The code is based on Emanuel Malvetti's semester thesis
at ETH in 2018, supervised by Raban Iten and Prof. Renato Renner.

References:

[1] Shende et al., Synthesis of Quantum Logic Circuits, 2009
`arXiv:0406176 <https://arxiv.org/pdf/quant-ph/0406176.pdf>`_

### `__init__`

```python
def __init__(self, diag: Sequence[complex]) -> None
```

Args:
    diag: list of the :math:`2^k` diagonal entries (for a diagonal gate on :math:`k` qubits).

### `validate_parameter`

```python
def validate_parameter(self, parameter)
```

Diagonal Gate parameter should accept complex
(in addition to the Gate parameter types) and always return built-in complex.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return the inverse of the diagonal gate.
