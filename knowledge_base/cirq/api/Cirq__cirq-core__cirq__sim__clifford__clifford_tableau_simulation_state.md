---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/clifford/clifford_tableau_simulation_state.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/clifford/clifford_tableau_simulation_state.py
license: Apache-2.0
---

## Module `cirq-core/cirq/sim/clifford/clifford_tableau_simulation_state.py`

A protocol for implementing high performance clifford tableau evolutions
for Clifford Simulator.

## `CliffordTableauSimulationState`

```python
class CliffordTableauSimulationState(StabilizerSimulationState[clifford_tableau.CliffordTableau])
```

State and context for an operation acting on a clifford tableau.

### `__init__`

```python
def __init__(self, tableau: cirq.CliffordTableau, prng: np.random.RandomState | None=None, qubits: Sequence[cirq.Qid] | None=None, classical_data: cirq.ClassicalDataStore | None=None)
```

Inits CliffordTableauSimulationState.

Args:
    tableau: The CliffordTableau to act on. Operations are expected to
        perform inplace edits of this object.
    qubits: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.
    prng: The pseudo random number generator to use for probabilistic
        effects.
    classical_data: The shared classical data container for this
        simulation.
