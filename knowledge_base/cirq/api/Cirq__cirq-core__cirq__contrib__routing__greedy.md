---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/routing/greedy.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/routing/greedy.py
license: Apache-2.0
---

## `route_circuit_greedily`

```python
def route_circuit_greedily(circuit: circuits.Circuit, device_graph: nx.Graph, **kwargs) -> SwapNetwork
```

Greedily routes a circuit on a given device.

Alternates between heuristically picking a few SWAPs to change the mapping
and applying all logical operations possible given the new mapping, until
all logical operations have been applied.

The SWAP selection heuristic is as follows. In every iteration, the
remaining two-qubit gates are partitioned into time slices. (See
utils.get_time_slices for details.) For each set of candidate SWAPs, the new
mapping is computed. For each time slice and every two-qubit gate therein,
the distance of the two logical qubits in the device graph under the new
mapping is calculated. A candidate set 'S' of SWAPs is taken out of
consideration if for some other set 'T' there is a time slice such that all
of the distances for 'T' are at most those for 'S' (and they are not all
equal).

If more than one candidate remains, the size of the set of SWAPs considered
is increased by one and the process is repeated. If after considering SWAP
sets of size up to 'max_search_radius', more than one candidate remains,
then the pairs of qubits in the first time slice are considered, and those
farthest away under the current mapping are brought together using SWAPs
using a shortest path in the device graph.

Args:
    circuit: The circuit to route.
    device_graph: The device's graph, in which each vertex is a qubit
        and each edge indicates the ability to do an operation on those
        qubits.
    **kwargs: Further keyword args, including
        max_search_radius: The maximum number of disjoint device edges to
            consider routing on.
        max_num_empty_steps: The maximum number of swap sets to apply
            without allowing a new logical operation to be performed.
        initial_mapping: The initial mapping of physical to logical qubits
            to use. Defaults to a greedy initialization.
        can_reorder: A predicate that determines if two operations may be
            reordered.
        random_state: Random state or random state seed.
