---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/two_qubit_diagonal_gate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/two_qubit_diagonal_gate.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/two_qubit_diagonal_gate.py`

Creates the gate instance for a two qubit diagonal gate.

The gate is used to create a 4x4 matrix with the diagonal elements
passed as a list.

## `TwoQubitDiagonalGate`

```python
class TwoQubitDiagonalGate(raw_types.Gate)
```

A two qubit gate whose unitary is a diagonal $4 \times 4$ matrix.

This gate's off-diagonal elements are zero and its on-diagonal
elements are all phases.

For example, `cirq.TwoQubitDiagonalGate([0, 1, -1, 0])` has the
unitary matrix

$$
\begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & e^i & 0 & 0 \\
    0 & 0 & e^{-i} & 0 \\
    0 & 0 & 0 & 1
\end{bmatrix}
$$

### `__init__`

```python
def __init__(self, diag_angles_radians: Sequence[value.TParamVal]) -> None
```

A two qubit gate with only diagonal elements.

This gate's off-diagonal elements are zero and its on-diagonal
elements are all phases.

Args:
    diag_angles_radians: The list of angles on the diagonal in radians.
        If these values are $(x_0, x_1, \ldots , x_3)$ then the unitary
        has diagonal values $(e^{i x_0}, e^{i x_1}, \ldots, e^{i x_3})$.
