---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/randomized_measurements.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/randomized_measurements.py
license: Apache-2.0
---

## `RandomizedMeasurements`

```python
class RandomizedMeasurements
```

A transformer that appends a moment of random rotations from a given unitary ensemble (pauli,
clifford, cue)

### `__init__`

```python
def __init__(self, subsystem: Sequence[int] | None=None)
```

Class structure for performing and analyzing a general randomized measurement protocol.
For more details on the randomized measurement toolbox see https://arxiv.org/abs/2203.11374

Args:
    subsystem: The specific subsystem (e.g., qubit index) to measure in a random basis.
        The rest of the qubits are measured in the computational basis.

### `__call__`

```python
def __call__(self, circuit: cirq.AbstractCircuit, unitary_ensemble: str='pauli', rng: np.random.Generator | None=None, *, context: transformer_api.TransformerContext | None=None) -> cirq.Circuit
```

Apply the transformer to the given circuit. Given an input circuit returns
a new circuit with the pre-measurement unitaries and measurement gates added
to the qubits in the subsystem provided. If no subsystem is specified in the
construction of this class, it defaults to measuring all the qubits in the
randomized bases.

Args:
    circuit: The circuit to add randomized measurements to.
    unitary_ensemble: Choice of unitary ensemble (pauli/clifford/cue(circular
        unitary ensemble))
    context: Not used; to satisfy transformer API.
    rng: Random number generator.

Returns:
    A circuit with pre-measurement unitaries and measurements added

### `random_single_qubit_unitary_moment`

```python
def random_single_qubit_unitary_moment(self, unitary_ensemble: str, qubits: Sequence[Any], rng: np.random.Generator) -> cirq.Moment
```

Outputs the cirq moment associated with the pre-measurement rotations.

Args:
    unitary_ensemble: clifford, pauli, cue
    qubits: List of qubits
    rng: Random number generator to be used in sampling.

Returns:
    The cirq moment associated with the pre-measurement rotations

Raises:
    ValueError: When unitary_ensemble is not one of "cue", "pauli" or "clifford"
