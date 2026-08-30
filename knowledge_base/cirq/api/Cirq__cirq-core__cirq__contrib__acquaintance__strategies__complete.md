---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/acquaintance/strategies/complete.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/acquaintance/strategies/complete.py
license: Apache-2.0
---

## `complete_acquaintance_strategy`

```python
def complete_acquaintance_strategy(qubit_order: Sequence[cirq.Qid], acquaintance_size: int=0, swap_gate: cirq.Gate=ops.SWAP) -> cirq.Circuit
```

Returns an acquaintance strategy with can handle the given number of qubits.

Args:
    qubit_order: The qubits on which the strategy should be defined.
    acquaintance_size: The maximum number of qubits to be acted on by
    an operation.
    swap_gate: The gate used to swap logical indices.

Returns:
    A circuit capable of implementing any set of k-local operations.

Raises:
    ValueError: If `acquaintance_size` is negative.
