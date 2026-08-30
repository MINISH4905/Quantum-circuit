---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/acquaintance/shift.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/acquaintance/shift.py
license: Apache-2.0
---

## `CircularShiftGate`

```python
class CircularShiftGate(PermutationGate)
```

Performs a cyclical permutation of the qubits to the left by a specified amount.

### `__init__`

```python
def __init__(self, num_qubits: int, shift: int, swap_gate: cirq.Gate=ops.SWAP) -> None
```

Construct a circular shift gate.

Args:
    num_qubits: The number of qubits to shift.
    shift: The number of positions to circularly left shift the qubits.
    swap_gate: The gate to use when decomposing.
