---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/generalized_gates/ucrx.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/generalized_gates/ucrx.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/generalized_gates/ucrx.py`

Uniformly controlled Pauli-X rotations.

## `UCRXGate`

```python
class UCRXGate(UCPauliRotGate)
```

Uniformly controlled Pauli-X rotations.

Implements the :class:`.UCGate` for the special case that all unitaries are Pauli-X rotations,
:math:`U_i = R_X(a_i)` where :math:`a_i \in \mathbb{R}` is the rotation angle.

### `__init__`

```python
def __init__(self, angle_list: list[float]) -> None
```

Args:
    angle_list: List of rotation angles :math:`[a_0, ..., a_{2^{k-1}}]`.
