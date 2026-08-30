---
framework: cirq
api_version: v1.7.0
doc_type: error
source_path: cirq-core/cirq/ops/raw_types.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/raw_types.py
license: Apache-2.0
---

## Error surface of `cirq-core/cirq/ops/raw_types.py`

### Validation

### `Qid.validate_dimension`

```python
def validate_dimension(dimension: int) -> None
```

Raises an exception if `dimension` is not positive.

Raises:
    ValueError: `dimension` is not positive.

### `Gate.validate_args`

```python
def validate_args(self, qubits: Sequence[cirq.Qid]) -> None
```

Checks if this gate can be applied to the given qubits.

By default checks that:
- inputs are of type `Qid`
- len(qubits) == num_qubits()
- qubit_i.dimension == qid_shape[i] for all qubits

Child classes can override.  The child implementation should call
`super().validate_args(qubits)` then do custom checks.

Args:
    qubits: The sequence of qubits to potentially apply the gate to.

Raises:
    ValueError: The gate can't be applied to the qubits.

### `Operation.validate_args`

```python
def validate_args(self, qubits: Sequence[cirq.Qid]) -> None
```

Raises an exception if the `qubits` don't match this operation's qid
shape.

Call this method from a subclass's `with_qubits` method.

Args:
    qubits: The new qids for the operation.

Raises:
    ValueError: The operation had qids that don't match it's qid shape.

## `_validate_qid_shape`

```python
def _validate_qid_shape(val: Any, qubits: Sequence[cirq.Qid]) -> None
```

Helper function to validate qubits for gates and operations.

Raises:
    ValueError: The operation had qids that don't match it's qid shape.
