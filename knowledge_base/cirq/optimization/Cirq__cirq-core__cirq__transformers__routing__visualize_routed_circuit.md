---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/routing/visualize_routed_circuit.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/routing/visualize_routed_circuit.py
license: Apache-2.0
---

## `routed_circuit_with_mapping`

```python
def routed_circuit_with_mapping(routed_circuit: cirq.AbstractCircuit, initial_map: dict[cirq.Qid, cirq.Qid] | None=None) -> cirq.AbstractCircuit
```

Returns the same circuits with information about the permutation of qubits after each swap.

Args:
    routed_circuit: a routed circuit that potentially has inserted swaps tagged with a
        RoutingSwapTag.
    initial_map: the initial mapping from logical to physical qubits. If this is not specified
        then the identity mapping of the qubits in routed_circuit will be used as initial_map.

Raises:
    ValueError: if a non-SWAP gate is tagged with a RoutingSwapTag.
