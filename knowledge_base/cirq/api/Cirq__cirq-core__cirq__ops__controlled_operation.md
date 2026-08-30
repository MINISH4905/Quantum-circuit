---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/controlled_operation.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/controlled_operation.py
license: Apache-2.0
---

## `ControlledOperation`

```python
class ControlledOperation(raw_types.Operation)
```

Augments existing operations to have one or more control qubits.

This object is typically created via `operation.controlled_by(*qubits)`.

### `__init__`

```python
def __init__(self, controls: Sequence[cirq.Qid], sub_operation: cirq.Operation, control_values: cv.AbstractControlValues | Sequence[int | Collection[int]] | None=None)
```

Initializes the controlled operation.

Args:
    controls: The qubits that control the sub-operation.
    sub_operation: The operation that will be controlled.
    control_values: Which control qubit values to apply the sub
        operation.  Either an object that inherits from AbstractControlValues
        or a sequence of length `num_controls` where each
        entry is an integer (or set of integers) corresponding to the
        qubit value (or set of possible values) where that control is
        enabled.  When all controls are enabled, the sub gate is
        applied.  If unspecified, control values default to 1.

Raises:
    ValueError: If the `control_values` or `control_qid_shape` does not
        match the number of qubits, if the `control_values` are out of
        bounds, if the qubits overlap, or if the sub_operation is not a
        unitary or mixture.
