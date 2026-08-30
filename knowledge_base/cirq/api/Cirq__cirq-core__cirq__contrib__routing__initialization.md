---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/routing/initialization.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/routing/initialization.py
license: Apache-2.0
---

## `get_initial_mapping`

```python
def get_initial_mapping(logical_graph: nx.Graph, device_graph: nx.Graph, random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> dict[ops.Qid, ops.Qid]
```

Gets an initial mapping of logical to physical qubits for routing.

Args:
    logical_graph: The graph whose edges correspond to pairs of qubits that
        should be mapped to nearby physical qubits.
    device_graph: The graph of the device.
    random_state: Random state or random state seed.

The mapping starts by mapping the center of the logical graph to the center
of the physical graph. Subsequent logical qubits are mapped to physical
qubits greedily. At each iteration, the logical qubits with the largest
number of already mapped neighbors and the physical qubits neighboring
those already mapped to are considered. The pair of logical and physical
qubits that minimizes the average distance to already mapped logical
neighbors is selected.
