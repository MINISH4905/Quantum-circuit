---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/diagonal_gate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/diagonal_gate.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/diagonal_gate.py`

Creates the gate instance for any number qubits diagonal gate.

The gate is used to create a (2^n)x(2^n) matrix with the diagonal elements
passed as a list.

## `DiagonalGate`

```python
class DiagonalGate(raw_types.Gate)
```

An n qubit gate which acts as phases on computational basis states.

This gate's off-diagonal elements are zero and its on-diagonal elements are
all phases.

### `__init__`

```python
def __init__(self, diag_angles_radians: Sequence[cirq.TParamVal]) -> None
```

A n-qubit gate with only diagonal elements.

This gate's off-diagonal elements are zero and its on-diagonal
elements are all phases.

Args:
    diag_angles_radians: The list of angles on the diagonal in radians.
        If these values are $(x_0, x_1, \ldots , x_N)$ then the unitary
        has diagonal values $(e^{i x_0}, e^{i x_1}, \ldots, e^{i x_N})$.
