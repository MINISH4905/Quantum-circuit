---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/routing/swap_network.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/routing/swap_network.py
license: Apache-2.0
---

## `SwapNetwork`

```python
class SwapNetwork
```

A swap network, i.e. a circuit containing logical operations and swaps
together with an initial mapping of physical to logical qubits.

Only instances of PermutationGate are considered as changing the mapping
between logical and physical qubits. This is, in part, to distinguish
between such gates and those with the same unitaries but that are part of
the logical circuit to be routed.

Args:
    circuit: The circuit.
    initial_mapping: The initial mapping from physical to logical qubits.
