---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/experiments/random_quantum_circuit_generation.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/experiments/random_quantum_circuit_generation.py
license: Apache-2.0
---

## Module `cirq-core/cirq/experiments/random_quantum_circuit_generation.py`

Code for generating random quantum circuits.

## `GridInteractionLayer`

```python
class GridInteractionLayer(Container[GridQubitPairT])
```

A layer of aligned or staggered two-qubit interactions on a grid.

Layers of this type have two different basic structures,
aligned:

*-* *-* *-*
*-* *-* *-*
*-* *-* *-*
*-* *-* *-*
*-* *-* *-*
*-* *-* *-*

and staggered:

*-* *-* *-*
* *-* *-* *
*-* *-* *-*
* *-* *-* *
*-* *-* *-*
* *-* *-* *

Other variants are obtained by offsetting these lattices to the right by
some number of columns, and/or transposing into the vertical orientation.
There are a total of 4 aligned and 4 staggered variants.

The 2x2 unit cells for the aligned and staggered versions of this layer
are, respectively:

*-*
*-*

and

*-*
* *-

with left/top qubits at (0, 0) and (1, 0) in the aligned case, or
(0, 0) and (1, 1) in the staggered case. Other variants have the same unit
cells after transposing and offsetting.

Args:
    col_offset: Number of columns by which to shift the basic lattice.
    vertical: Whether gates should be oriented vertically rather than
        horizontally.
    stagger: Whether to stagger gates in neighboring rows.

### `__contains__`

```python
def __contains__(self, pair) -> bool
```

Checks whether a pair is in this layer.

## `random_rotations_between_two_qubit_circuit`

```python
def random_rotations_between_two_qubit_circuit(q0: cirq.Qid, q1: cirq.Qid, depth: int, two_qubit_op_factory: Callable[[cirq.Qid, cirq.Qid, np.random.RandomState], cirq.OP_TREE]=lambda a, b, _: ops.CZPowGate()(a, b), single_qubit_gates: Sequence[cirq.Gate]=(ops.X ** 0.5, ops.Y ** 0.5, ops.PhasedXPowGate(phase_exponent=0.25, exponent=0.5)), add_final_single_qubit_layer: bool=True, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> cirq.Circuit
```

Generate a random two-qubit quantum circuit.

This construction uses a similar structure to those in the paper
https://www.nature.com/articles/s41586-019-1666-5.

The generated circuit consists of a number of "cycles", this number being
specified by `depth`. Each cycle is actually composed of two sub-layers:
a layer of single-qubit gates followed by a layer of two-qubit gates,
controlled by their respective arguments, see below.

Args:
    q0: The first qubit
    q1: The second qubit
    depth: The number of cycles.
    two_qubit_op_factory: A callable that returns a two-qubit operation.
        These operations will be generated with calls of the form
        `two_qubit_op_factory(q0, q1, prng)`, where `prng` is the
        pseudorandom number generator.
    single_qubit_gates: Single-qubit gates are selected randomly from this
        sequence. No qubit is acted upon by the same single-qubit gate in
        consecutive cycles. If only one choice of single-qubit gate is
        given, then this constraint is not enforced.
    add_final_single_qubit_layer: Whether to include a final layer of
        single-qubit gates after the last cycle (subject to the same
        non-consecutivity constraint).
    seed: A seed or random state to use for the pseudorandom number
        generator.

## `generate_library_of_2q_circuits`

```python
def generate_library_of_2q_circuits(n_library_circuits: int, two_qubit_gate: cirq.Gate, *, max_cycle_depth: int=100, q0: cirq.Qid=devices.LineQubit(0), q1: cirq.Qid=devices.LineQubit(1), random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None, tags: Sequence[Any]=()) -> list[cirq.Circuit]
```

Generate a library of two-qubit Circuits.

For single-qubit gates, this uses PhasedXZGates where the axis-in-XY-plane is one
of eight eighth turns and the Z rotation angle is one of eight eighth turns. This
provides 8*8=64 total choices, each implementable with one PhasedXZGate. This is
appropriate for architectures with microwave single-qubit control.

Args:
    n_library_circuits: The number of circuits to generate.
    two_qubit_gate: The two qubit gate to use in the circuits.
    max_cycle_depth: The maximum cycle_depth in the circuits to generate. If you are using XEB,
        this must be greater than or equal to the maximum value in `cycle_depths`.
    q0: The first qubit to use when constructing the circuits.
    q1: The second qubit to use when constructing the circuits
    random_state: A random state or seed used to deterministically sample the random circuits.
    tags: Tags to add to the two qubit operations.

## `CircuitLibraryCombination`

```python
class CircuitLibraryCombination
```

For a given layer (specifically, a set of pairs of qubits), `combinations` is a 2d array
of shape (n_combinations, len(pairs)) where each row represents a combination (with replacement)
of two-qubit circuits. The actual values are indices into a list of library circuits.

`layer` is used for record-keeping. This is the GridInteractionLayer if using
`get_random_combinations_for_device`, the Moment if using
`get_random_combinations_for_layer_circuit` and ommitted if using
`get_random_combinations_for_pairs`.

## `get_random_combinations_for_device`

```python
def get_random_combinations_for_device(n_library_circuits: int, n_combinations: int, device_graph: nx.Graph, *, pattern: Sequence[GridInteractionLayer]=HALF_GRID_STAGGERED_PATTERN, random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> list[CircuitLibraryCombination]
```

For a given device, prepare a set of combinations to efficiently sample
parallel two-qubit XEB circuits.

Args:
    n_library_circuits: The number of circuits in your library. Likely the value
        passed to `generate_library_of_2q_circuits`.
    n_combinations: The number of combinations (with replacement) to generate
        using the library circuits. Since this function returns a
        `CircuitLibraryCombination`, the combinations will be represented
        by indexes between 0 and `n_library_circuits-1` instead of the circuits
        themselves. The more combinations, the more precise of an estimate for XEB
        fidelity estimation, but a corresponding increase in the number of circuits
        you must sample.
    device_graph: A graph whose nodes are qubits and whose edges represent
        the possibility of doing a two-qubit gate. This combined with the
        `pattern` argument determines which two qubit pairs are activated
        when.
    pattern: A sequence of `GridInteractionLayer`, each of which has
        a particular set of qubits that are activated simultaneously. These
        pairs of qubits are deduced by combining this argument with `device_graph`.
    random_state: A random-state-like object to seed the random combination generation.

Returns:
    A list of `CircuitLibraryCombination`, each corresponding to an interaction
    layer in `pattern` where there is a non-zero number of pairs which would be activated.
    Each object has a `combinations` matrix of circuit
    indices of shape `(n_combinations, len(pairs))` where `len(pairs)` may
    be different for each entry (i.e. for each layer in `pattern`). This
    returned list can be provided to `sample_2q_xeb_circuits` to efficiently
    sample parallel XEB circuits.

## `get_random_combinations_for_pairs`

```python
def get_random_combinations_for_pairs(n_library_circuits: int, n_combinations: int, all_pairs: list[list[QidPairT]], random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> list[CircuitLibraryCombination]
```

For an explicit nested list of pairs, prepare a set of combinations to efficiently sample
parallel two-qubit XEB circuits.

Args:
    n_library_circuits: The number of circuits in your library. Likely the value
        passed to `generate_library_of_2q_circuits`.
    n_combinations: The number of combinations (with replacement) to generate
        using the library circuits. Since this function returns a
        `CircuitLibraryCombination`, the combinations will be represented
        by indexes between 0 and `n_library_circuits-1` instead of the circuits
        themselves. The more combinations, the more precise of an estimate for XEB
        fidelity estimation, but a corresponding increase in the number of circuits
        you must sample.
    all_pairs: A nested list of qubit pairs. The outer list should represent a "layer"
        where the inner pairs should all be able to be activated simultaneously.
    random_state: A random-state-like object to seed the random combination generation.

Returns:
    A list of `CircuitLibraryCombination`, each corresponding to an interaction
    layer the outer list of `all_pairs`. Each object has a `combinations` matrix of circuit
    indices of shape `(n_combinations, len(pairs))` where `len(pairs)` may
    be different for each entry. This
    returned list can be provided to `sample_2q_xeb_circuits` to efficiently
    sample parallel XEB circuits.

## `get_random_combinations_for_layer_circuit`

```python
def get_random_combinations_for_layer_circuit(n_library_circuits: int, n_combinations: int, layer_circuit: cirq.Circuit, random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> list[CircuitLibraryCombination]
```

For a layer circuit, prepare a set of combinations to efficiently sample
parallel two-qubit XEB circuits.

Args:
    n_library_circuits: The number of circuits in your library. Likely the value
        passed to `generate_library_of_2q_circuits`.
    n_combinations: The number of combinations (with replacement) to generate
        using the library circuits. Since this function returns a
        `CircuitLibraryCombination`, the combinations will be represented
        by indexes between 0 and `n_library_circuits-1` instead of the circuits
        themselves. The more combinations, the more precise of an estimate for XEB
        fidelity estimation, but a corresponding increase in the number of circuits
        you must sample.
    layer_circuit: A calibration-style circuit where each Moment represents a layer.
        Two qubit operations indicate the pair should be activated. This circuit should
        only contain Moments which only contain two-qubit operations.
    random_state: A random-state-like object to seed the random combination generation.

Returns:
    A list of `CircuitLibraryCombination`, each corresponding to a moment in `layer_circuit`.
    Each object has a `combinations` matrix of circuit
    indices of shape `(n_combinations, len(pairs))` where `len(pairs)` may
    be different for each entry (i.e. for moment). This
    returned list can be provided to `sample_2q_xeb_circuits` to efficiently
    sample parallel XEB circuits.

## `get_grid_interaction_layer_circuit`

```python
def get_grid_interaction_layer_circuit(device_graph: nx.Graph, pattern: Sequence[GridInteractionLayer]=HALF_GRID_STAGGERED_PATTERN, two_qubit_gate=ops.ISWAP ** 0.5) -> cirq.Circuit
```

Create a circuit representation of a grid interaction pattern on a given device topology.

The resulting circuit is deterministic, of depth len(pattern), and consists of `two_qubit_gate`
applied to each pair in `pattern` restricted to available connections in `device_graph`.

Args:
    device_graph: A graph whose nodes are qubits and whose edges represent the possibility of
        doing a two-qubit gate. This combined with the `pattern` argument determines which
        two qubit pairs are activated when.
    pattern: A sequence of `GridInteractionLayer`, each of which has a particular set of
        qubits that are activated simultaneously. These pairs of qubits are deduced by
        combining this argument with `device_graph`.
    two_qubit_gate: The two qubit gate to use in constructing the circuit layers.

## `random_rotations_between_grid_interaction_layers_circuit`

```python
def random_rotations_between_grid_interaction_layers_circuit(qubits: Iterable[cirq.GridQubit], depth: int, *, two_qubit_op_factory: Callable[[cirq.GridQubit, cirq.GridQubit, np.random.RandomState], cirq.OP_TREE]=lambda a, b, _: ops.CZPowGate()(a, b), pattern: Sequence[GridInteractionLayer]=GRID_STAGGERED_PATTERN, single_qubit_gates: Sequence[cirq.Gate]=(ops.X ** 0.5, ops.Y ** 0.5, ops.PhasedXPowGate(phase_exponent=0.25, exponent=0.5)), add_final_single_qubit_layer: bool=True, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> cirq.Circuit
```

Generate a random quantum circuit of a particular form.

This construction is based on the circuits used in the paper
https://www.nature.com/articles/s41586-019-1666-5.

The generated circuit consists of a number of "cycles", this number being
specified by `depth`. Each cycle is actually composed of two sub-layers:
a layer of single-qubit gates followed by a layer of two-qubit gates,
controlled by their respective arguments, see below. The pairs of qubits
in a given entangling layer is controlled by the `pattern` argument,
see below.

Args:
    qubits: The qubits to use.
    depth: The number of cycles.
    two_qubit_op_factory: A callable that returns a two-qubit operation.
        These operations will be generated with calls of the form
        `two_qubit_op_factory(q0, q1, prng)`, where `prng` is the
        pseudorandom number generator.
    pattern: A sequence of GridInteractionLayers, each of which determine
        which pairs of qubits are entangled. The layers in a pattern are
        iterated through sequentially, repeating until `depth` is reached.
    single_qubit_gates: Single-qubit gates are selected randomly from this
        sequence. No qubit is acted upon by the same single-qubit gate in
        consecutive cycles. If only one choice of single-qubit gate is
        given, then this constraint is not enforced.
    add_final_single_qubit_layer: Whether to include a final layer of
        single-qubit gates after the last cycle.
    seed: A seed or random state to use for the pseudorandom number
        generator.
