---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/generalized_gates/uc_pauli_rot.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/generalized_gates/uc_pauli_rot.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/generalized_gates/uc_pauli_rot.py`

Uniformly controlled Pauli rotations.

## `UCPauliRotGate`

```python
class UCPauliRotGate(Gate)
```

Uniformly controlled Pauli rotations.

Implements the :class:`.UCGate` for the special case that all unitaries are Pauli rotations,
:math:`U_i = R_P(a_i)` where :math:`P \in \{X, Y, Z\}` and :math:`a_i \in \mathbb{R}` is
the rotation angle.

### `__init__`

```python
def __init__(self, angle_list: list[float], rot_axis: str) -> None
```

Args:
    angle_list: List of rotation angles :math:`[a_0, ..., a_{2^{k-1}}]`.
    rot_axis: Rotation axis. Must be either of ``"X"``, ``"Y"`` or ``"Z"``.
