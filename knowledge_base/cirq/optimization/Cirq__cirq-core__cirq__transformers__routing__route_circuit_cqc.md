---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/routing/route_circuit_cqc.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/routing/route_circuit_cqc.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/routing/route_circuit_cqc.py`

Heuristic qubit routing algorithm based on arxiv:1902.08091.

## `RouteCQC`

```python
class RouteCQC
```

Transformer class that implements a circuit routing algorithm.

The algorithm proceeds as follows:

1. Computes the timesteps (two_qubit_ops) of the circuit: considering operations in the given
    circuit from beginning to end, the next timestep is a maximal set of 2-qubit operations
    that act on disjoint qubits. It is 'maximal' because any 2-qubit gate's qubits in the next
    timestep must intersect with the qubits that are acted on in the current timestep.

2. Places the logical qubits in the input circuit onto some input device graph by using an
    initial mapper (`cirq.LineInitialMapper` by default).

3. Insert necessary swaps to ensure all 2-qubit gates are between adjacent qubits on the device
    graph by traversing the timesteps from left to right and for each timestep:
        1. Remove any single qubit gate and executable 2-qubit gate in the current
            timestep and add it to the output routed circuit.
        2. If there aren't any gates left in the current timestep, move on to the next.
        3. If there are gates remaining in the current timestep, consider a set of
            candidate swaps on them and rank them based on a heuristic cost function. Pick
            the swap that minimises the cost and use it to update our logical to physical
            mapping. Repeat from 3.1.

Handling Directed Graphs:

    When the device_graph is directed (e.g., edges represent unidirectional CNOT constraints),
    the routing logic still operates as if the graph were undirected. This is because SWAP
    gates are logically symmetric regardless of underlying gate direction constraints.
    After routing completes, any inserted SWAP gates are decomposed into a directional-aware
    sequence using the Hadamard trick:
    ``SWAP = CNOT(ctrl, tgt) - H⊗H - CNOT(ctrl, tgt) - H⊗H - CNOT(ctrl, tgt)``

For example:

    >>> import cirq_google as cg
    >>> circuit = cirq.testing.random_circuit(5, 10, 0.6)
    >>> device = cg.Sycamore
    >>> router = cirq.RouteCQC(device.metadata.nx_graph)
    >>> rcirc, initial_map, swap_map = router.route_circuit(circuit)
    >>> fcirc = cirq.optimize_for_target_gateset(rcirc, gateset = cg.SycamoreTargetGateset())
    >>> device.validate_circuit(fcirc)
    >>> cirq.testing.assert_circuits_have_same_unitary_given_final_permutation(
    ...     rcirc, circuit.transform_qubits(initial_map), swap_map
    ... )

### `__init__`

```python
def __init__(self, device_graph: nx.Graph)
```

Initializes the circuit routing transformer.

Args:
    device_graph: The connectivity graph of physical qubits.
        Can be directed or undirected.

### `__call__`

```python
def __call__(self, circuit: cirq.AbstractCircuit, *, lookahead_radius: int=8, tag_inserted_swaps: bool=False, initial_mapper: cirq.AbstractInitialMapper | None=None, context: cirq.TransformerContext | None=None) -> cirq.AbstractCircuit
```

Transforms the given circuit to make it executable on the device.

This method calls self.route_circuit and returns the routed circuit. See docstring of
`RouteCQC.route_circuit` for more details on routing.

Args:
    circuit: the input circuit to be transformed.
    lookahead_radius: the maximum number of succeeding timesteps the algorithm will
        consider for ranking candidate swaps with the cost cost function.
    tag_inserted_swaps: whether or not a `cirq.RoutingSwapTag` should be attached to
        inserted swap operations.
    initial_mapper: an initial mapping strategy (placement) of logical qubits in the
        circuit onto physical qubits on the device. If not provided, defaults to an
        instance of `cirq.LineInitialMapper`.
    context: transformer context storing common configurable options for transformers.

Returns:
    The routed circuit, which is equivalent to original circuit up to a final qubit
        permutation and where each 2-qubit operation is between adjacent qubits in the
        `device_graph`.

Raises:
    ValueError: if circuit has operations that act on 3 or more qubits, except measurements.

### `route_circuit`

```python
def route_circuit(self, circuit: cirq.AbstractCircuit, *, lookahead_radius: int=8, tag_inserted_swaps: bool=False, initial_mapper: cirq.AbstractInitialMapper | None=None, context: cirq.TransformerContext | None=None) -> tuple[cirq.AbstractCircuit, dict[cirq.Qid, cirq.Qid], dict[cirq.Qid, cirq.Qid]]
```

Transforms the given circuit to make it executable on the device.

This transformer assumes that all multi-qubit operations have been decomposed into 2-qubit
operations and will raise an error if `circuit` a n-qubit operation where n > 2. If
`circuit` contains `cirq.CircuitOperation`s and `context.deep` is True then they are first
unrolled before proceeding. If `context.deep` is False or `context` is None then any
`cirq.CircuitOperation` that acts on more than 2-qubits will also raise an error.

The algorithm tries to find the best swap at each timestep by ranking a set of candidate
swaps against operations starting from the current timestep (say s) to the timestep at index
s + `lookahead_radius` to prune the set of candidate swaps. If it fails  to converge to a to
a single swap because of highly symmetrical device or circuit connectivity, then symmetry
breaking strategies are used.

Since routing doesn't necessarily modify any specific operation and only adds swaps
before / after operations to ensure the circuit can be executed, tagging operations with
tags from context.tags_to_ignore will have no impact on the routing procedure.

Args:
    circuit: the input circuit to be transformed.
    lookahead_radius: the maximum number of succeeding timesteps the algorithm will
        consider for ranking candidate swaps with the cost cost function.
    tag_inserted_swaps: whether or not a RoutingSwapTag should be attached to inserted swap
        operations.
    initial_mapper: an initial mapping strategy (placement) of logical qubits in the
        circuit onto physical qubits on the device.
    context: transformer context storing common configurable options for transformers.

Returns:
    The routed circuit, which is equivalent to original circuit up to a final qubit
        permutation and where each 2-qubit operation is between adjacent qubits in the
        `device_graph`.
    The initial mapping from logical to physical qubits used as part of the routing
        procedure.
    The mapping from physical qubits before inserting swaps to physical qubits after
        inserting swaps.

Raises:
    ValueError: if circuit has operations that act on 3 or more qubits, except measurements.
