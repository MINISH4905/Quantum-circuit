---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/clifford/stabilizer_simulation_state.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/clifford/stabilizer_simulation_state.py
license: Apache-2.0
---

## `StabilizerSimulationState`

```python
class StabilizerSimulationState(SimulationState[TStabilizerState], Generic[TStabilizerState], metaclass=abc.ABCMeta)
```

Abstract wrapper around a stabilizer state for the act_on protocol.

### `__init__`

```python
def __init__(self, *, state: TStabilizerState, prng: np.random.RandomState | None=None, qubits: Sequence[cirq.Qid] | None=None, classical_data: cirq.ClassicalDataStore | None=None)
```

Initializes the StabilizerSimulationState.

Args:
    state: The quantum stabilizer state to use in the simulation or
        act_on invocation.
    prng: The pseudo random number generator to use for probabilistic
        effects.
    qubits: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.
    classical_data: The shared classical data container for this
        simulation.
