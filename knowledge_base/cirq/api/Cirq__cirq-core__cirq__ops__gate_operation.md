---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/gate_operation.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/gate_operation.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/gate_operation.py`

Basic types defining qubits, gates, and operations.

## `GateOperation`

```python
class GateOperation(raw_types.Operation)
```

An application of a gate to a sequence of qubits.

Objects of this type are immutable.

### `__init__`

```python
def __init__(self, gate: cirq.Gate, qubits: Sequence[cirq.Qid]) -> None
```

Inits GateOperation.

Args:
    gate: The gate to apply.
    qubits: The qubits to operate on.

### `gate`

```python
def gate(self) -> cirq.Gate
```

The gate applied by the operation.

### `qubits`

```python
def qubits(self) -> tuple[cirq.Qid, ...]
```

The qubits targeted by the operation.

### `__pow__`

```python
def __pow__(self, exponent: Any) -> cirq.Operation
```

Raise gate to a power, then reapply to the same qubits.

Only works if the gate implements cirq.ExtrapolatableEffect.
For extrapolatable gate G this means the following two are equivalent:

    (G ** 1.5)(qubit)  or  G(qubit) ** 1.5

Args:
    exponent: The amount to scale the gate's effect by.

Returns:
    A new operation on the same qubits with the scaled gate.
