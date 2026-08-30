---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/controlled_gate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/controlled_gate.py
license: Apache-2.0
---

## `ControlledGate`

```python
class ControlledGate(raw_types.Gate)
```

Augments existing gates to have one or more control qubits.

This object is typically created via `gate.controlled()`.

### `__init__`

```python
def __init__(self, sub_gate: cirq.Gate, num_controls: int | None=None, control_values: cv.AbstractControlValues | Sequence[int | Collection[int]] | None=None, control_qid_shape: Sequence[int] | None=None) -> None
```

Initializes the controlled gate. If no arguments are specified for
   the controls, defaults to a single qubit control.

Args:
    sub_gate: The gate to add a control qubit to.
    num_controls: Total number of control qubits.
    control_values: For which control qubit values to apply the sub
        gate.  Either an object that inherits from AbstractControlValues
        or a sequence of length `num_controls` where each
        entry is an integer (or set of integers) corresponding to the
        qubit value (or set of possible values) where that control is
        enabled.  When all controls are enabled, the sub gate is
        applied.  If unspecified, control values default to 1.
    control_qid_shape: The qid shape of the controls.  A tuple of the
        expected dimension of each control qid.  Defaults to
        `(2,) * num_controls`.  Specify this argument when using qudits.

Raises:
    ValueError: If the `control_values` or `control_qid_shape` does not
        match with `num_controls`, if the `control_values` are out of
        bounds, or if the sub_gate is not a unitary or mixture.
