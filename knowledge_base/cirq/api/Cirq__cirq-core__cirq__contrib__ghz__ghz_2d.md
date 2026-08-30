---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/ghz/ghz_2d.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/ghz/ghz_2d.py
license: Apache-2.0
---

## Module `cirq-core/cirq/contrib/ghz/ghz_2d.py`

Functions for generating and transforming 2D GHZ circuits.

## `generate_2d_ghz_circuit`

```python
def generate_2d_ghz_circuit(center: devices.GridQubit, graph: nx.Graph, num_qubits: int, randomized: bool=False, rng_or_seed: int | np.random.Generator | None=None, add_dd_and_align_right: bool=False) -> circuits.Circuit
```

Generates a 2D GHZ state circuit with 'num_qubits' qubits using BFS.

The circuit is constructed by connecting qubits
sequentially based on graph connectivity,
starting from the 'center' qubit.
The GHZ state is built using a series of H-CZ-H
gate sequences.


Args:
    center: The starting qubit for the GHZ state.
    graph: The connectivity graph of the qubits.
    num_qubits:  The number of qubits for the final
                 GHZ state. Must be greater than 0,
                 and less than or equal to
                 the total number of qubits
                 on the processor.
    randomized:  If True, neighbors are
                 added to the circuit in a random order.
                 If False, they are
                 added by distance from the center.
    rng_or_seed: An optional seed or numpy random number
                 generator. Used only when randomized is True
    add_dd_and_align_right: If True, adds dynamical
                            decoupling and aligns right.

Returns:
    A cirq.Circuit object for the GHZ state.

Raises:
    ValueError: If num_qubits is non-positive or exceeds the total
                number of qubits on the processor.
