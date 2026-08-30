---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/acquaintance/bipartite.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/acquaintance/bipartite.py
license: Apache-2.0
---

## `BipartiteSwapNetworkGate`

```python
class BipartiteSwapNetworkGate(PermutationGate)
```

A swap network that acquaints qubits in one half with qubits in the
other.


Acts on 2k qubits, acquainting some of the first k qubits with some of the
latter k. May have the effect permuting the qubits within each half.

Possible subgraphs include:
    MATCHING: acquaints qubit 1 with qubit (2k - 1), qubit 2 with qubit
        (2k- 2), and so on through qubit k with qubit k + 1.
    COMPLETE: acquaints each of qubits 1 through k with each of qubits k +
        1 through 2k.

Args:
    part_size: The number of qubits in each half.
    subgraph: The bipartite subgraph of pairs of qubits to acquaint.
    swap_gate: The gate used to swap logical indices.

Attributes:
    part_size: See above.
    subgraph: See above.
    swap_gate: See above.
