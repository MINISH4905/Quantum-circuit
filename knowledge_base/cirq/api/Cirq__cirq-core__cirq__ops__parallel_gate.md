---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/parallel_gate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/parallel_gate.py
license: Apache-2.0
---

## `ParallelGate`

```python
class ParallelGate(raw_types.Gate)
```

Augments existing gates to be applied on one or more groups of qubits.

### `__init__`

```python
def __init__(self, sub_gate: cirq.Gate, num_copies: int) -> None
```

Inits ParallelGate.

Args:
    sub_gate: The gate to apply.
    num_copies: Number of copies of the gate to apply in parallel.

Raises:
    ValueError: If gate is not a single qubit gate or num_copies <= 0.

### `with_gate`

```python
def with_gate(self, sub_gate: cirq.Gate) -> ParallelGate
```

ParallelGate with same number of copies but a new gate

### `with_num_copies`

```python
def with_num_copies(self, num_copies: int) -> ParallelGate
```

ParallelGate with same sub_gate but different num_copies

### `__pow__`

```python
def __pow__(self, exponent: Any) -> ParallelGate
```

Raises underlying gate to a power, applying same number of copies.

For extrapolatable gate G this means the following two are equivalent:

    (G ** 1.5) x k  or  (G x k) ** 1.5

Args:
    exponent: The amount to scale the gate's effect by.

Returns:
    ParallelGate with same num_copies with the scaled underlying gate.

## `parallel_gate_op`

```python
def parallel_gate_op(gate: cirq.Gate, *targets: cirq.Qid) -> cirq.Operation
```

Constructs a ParallelGate using gate and applies to all given qubits

Args:
    gate: The gate to apply
    *targets: The qubits on which the ParallelGate should be applied.

Returns:
    ParallelGate(gate, len(targets)).on(*targets)
