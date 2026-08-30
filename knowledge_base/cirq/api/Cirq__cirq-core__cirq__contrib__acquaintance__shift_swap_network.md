---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/acquaintance/shift_swap_network.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/acquaintance/shift_swap_network.py
license: Apache-2.0
---

## `ShiftSwapNetworkGate`

```python
class ShiftSwapNetworkGate(PermutationGate)
```

A swap network that generalizes the circular shift gate.

Given a specification of two partitions, implements a swap network that has
the overall effect of:
    * For every pair of parts, one from each partition, acquainting the
        union of the corresponding qubits.
    * Circularly shifting the two sets of qubits.

Args:
    left_part_lens: The sizes of the parts in the partition of the first
        set of qubits.
    right_part_lens: The sizes of the parts in the partition of the second
        set of qubits.
    swap_gate: The gate to use when decomposing.

Attributes:
    part_lens: A mapping from the side (as a str, 'left' or 'right') to the
        part sizes of the corresponding partition.
    swap_gate: The gate to use when decomposing.
