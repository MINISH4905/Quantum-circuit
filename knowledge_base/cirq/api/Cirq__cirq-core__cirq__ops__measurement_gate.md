---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/measurement_gate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/measurement_gate.py
license: Apache-2.0
---

## `MeasurementGate`

```python
class MeasurementGate(raw_types.Gate)
```

A gate that measures qubits in the computational basis.

The measurement gate contains a key that is used to identify results
of measurements.

Instead of constructing this directly, consider using the `cirq.measure`
helper method.

### `__init__`

```python
def __init__(self, num_qubits: int | None=None, key: str | cirq.MeasurementKey='', invert_mask: tuple[bool, ...]=(), qid_shape: tuple[int, ...] | None=None, confusion_map: dict[tuple[int, ...], np.ndarray] | None=None) -> None
```

Inits MeasurementGate.

Args:
    num_qubits: The number of qubits to act upon.
    key: The string key of the measurement.
    invert_mask: A list of values indicating whether the corresponding
        qubits should be flipped. The list's length must not be longer
        than the number of qubits, but it is permitted to be shorter.
        Qubits with indices past the end of the mask are not flipped.
    qid_shape: Specifies the dimension of each qid the measurement
        applies to.  The default is 2 for every qubit.
    confusion_map: A map of qubit index sets (using indices in the
        operation generated from this gate) to the 2D confusion matrix
        for those qubits. Indices not included use the identity.
        Applied before invert_mask if both are provided.

Raises:
    ValueError: If invert_mask or confusion_map have indices
        greater than the available qubit indices, or if the length of
        qid_shape doesn't equal num_qubits.

### `with_key`

```python
def with_key(self, key: str | cirq.MeasurementKey) -> MeasurementGate
```

Creates a measurement gate with a new key but otherwise identical.

### `with_bits_flipped`

```python
def with_bits_flipped(self, *bit_positions: int) -> MeasurementGate
```

Toggles whether or not the measurement inverts various outputs.

This only affects the invert_mask, which is applied after confusion
matrices if any are defined.

### `full_invert_mask`

```python
def full_invert_mask(self) -> tuple[bool, ...]
```

Returns the invert mask for all qubits.

If the user supplies a partial invert_mask, this returns that mask
padded by False.

Similarly if no invert_mask is supplies this returns a tuple
of size equal to the number of qubits with all entries False.
