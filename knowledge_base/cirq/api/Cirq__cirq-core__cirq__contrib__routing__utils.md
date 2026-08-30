---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/routing/utils.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/routing/utils.py
license: Apache-2.0
---

## `get_time_slices`

```python
def get_time_slices(dag: CircuitDag) -> list[nx.Graph]
```

Slices the DAG into logical graphs.

Each time slice is a graph whose vertices are qubits and whose edges
correspond to two-qubit gates. Single-qubit gates are ignored (and
more-than-two-qubit gates are not supported).

The edges of the first time slice correspond to the nodes of the DAG without
predecessors. (Again, single-qubit gates are ignored.) The edges of the
second slice correspond to the nodes of the DAG whose only predecessors are
in the first time slice, and so on.

## `is_valid_routing`

```python
def is_valid_routing(circuit: circuits.Circuit, swap_network: SwapNetwork, *, equals: BINARY_OP_PREDICATE=operator.eq, can_reorder: BINARY_OP_PREDICATE=lambda op1, op2: not set(op1.qubits) & set(op2.qubits)) -> bool
```

Determines whether a swap network is consistent with a given circuit.

Args:
    circuit: The circuit.
    swap_network: The swap network whose validity is to be checked.
    equals: The function to determine equality of operations. Defaults to
        `operator.eq`.
    can_reorder: A predicate that determines if two operations may be
        reordered.

Raises:
    ValueError: If equals operator or can_reorder throws a ValueError.

## `get_circuit_connectivity`

```python
def get_circuit_connectivity(circuit: cirq.Circuit) -> nx.Graph
```

Return a graph of all 2q interactions in a circuit.

Nodes are qubits and undirected edges correspond to any two-qubit
operation.
