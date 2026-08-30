---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/generalized_gates/isometry.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/generalized_gates/isometry.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/generalized_gates/isometry.py`

Generic isometries from m to n qubits.

## `Isometry`

```python
class Isometry(Instruction)
```

Decomposition of arbitrary isometries from :math:`m` to :math:`n` qubits.

In particular, this allows to decompose unitaries (m=n) and to do state preparation (:math:`m=0`).

The decomposition is based on [1].

References:

[1] Iten et al., Quantum circuits for isometries (2016).
`Phys. Rev. A 93, 032318
<https://journals.aps.org/pra/abstract/10.1103/PhysRevA.93.032318>`__.

### `__init__`

```python
def __init__(self, isometry: np.ndarray, num_ancillas_zero: int, num_ancillas_dirty: int, epsilon: float=_EPS) -> None
```

Args:
    isometry: An isometry from :math:`m` to :math`n` qubits, i.e., a complex
        ``np.ndarray`` of dimension :math:`2^n \times 2^m` with orthonormal columns (given
        in the computational basis specified by the order of the ancillas
        and the input qubits, where the ancillas are considered to be more
        significant than the input qubits).
    num_ancillas_zero: Number of additional ancillas that start in the state :math:`|0\rangle`
        (the :math:`n-m` ancillas required for providing the output of the isometry are
        not accounted for here).
    num_ancillas_dirty: Number of additional ancillas that start in an arbitrary state.
    epsilon: Error tolerance of calculations.

### `validate_parameter`

```python
def validate_parameter(self, parameter)
```

Isometry parameter has to be an ndarray.

### `inv_gate`

```python
def inv_gate(self)
```

Return the adjoint of the unitary.
