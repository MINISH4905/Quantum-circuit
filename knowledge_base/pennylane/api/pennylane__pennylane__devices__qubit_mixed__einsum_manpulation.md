---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qubit_mixed/einsum_manpulation.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qubit_mixed/einsum_manpulation.py
license: Apache-2.0
---

## Module `pennylane/devices/qubit_mixed/einsum_manpulation.py`

Functions and variables to be utilized by qutrit mixed state simulator.

## `get_einsum_mapping`

```python
def get_einsum_mapping(op: qp.operation.Operator, state, is_state_batched: bool=False)
```

Finds the indices for einsum to apply kraus operators to a mixed state
Args:
    op (Operator): Operator to apply to the quantum state
    state (array[complex]): Input quantum state
    map_indices (function): Maps the calculated indices to an einsum indices string
    is_state_batched (bool): Boolean representing whether the state is batched or not
Returns:
    str: Indices mapping that defines the einsum
