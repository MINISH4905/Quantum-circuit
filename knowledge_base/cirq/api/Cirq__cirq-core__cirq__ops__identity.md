---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/identity.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/identity.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/identity.py`

IdentityGate.

## `IdentityGate`

```python
class IdentityGate(raw_types.Gate)
```

A Gate that perform no operation on qubits.

The unitary matrix of this gate is a diagonal matrix with all 1s on the
diagonal and all 0s off the diagonal in any basis.

`cirq.I` is the single qubit identity gate.

### `__init__`

```python
def __init__(self, num_qubits: int | None=None, qid_shape: tuple[int, ...] | None=None) -> None
```

Inits IdentityGate.

Args:
    num_qubits: The number of qubits for the identity gate.
    qid_shape: Specifies the dimension of each qid the measurement
        applies to.  The default is 2 for every qubit.

Raises:
    ValueError: If the length of qid_shape doesn't equal num_qubits, or
        neither `num_qubits` or `qid_shape` is supplied.

## `identity_each`

```python
def identity_each(*qubits: cirq.Qid) -> cirq.Operation
```

Returns a single IdentityGate applied to all the given qubits.

Args:
    *qubits: The qubits that the identity gate will apply to.

Returns:
    An identity operation on the given qubits.

Raises:
    ValueError: If the qubits are not instances of Qid.
