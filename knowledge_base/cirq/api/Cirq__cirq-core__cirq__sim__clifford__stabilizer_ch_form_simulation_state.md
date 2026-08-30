---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/clifford/stabilizer_ch_form_simulation_state.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/clifford/stabilizer_ch_form_simulation_state.py
license: Apache-2.0
---

## `StabilizerChFormSimulationState`

```python
class StabilizerChFormSimulationState(StabilizerSimulationState[stabilizer_state_ch_form.StabilizerStateChForm])
```

Wrapper around a stabilizer state in CH form for the act_on protocol.

### `__init__`

```python
def __init__(self, *, prng: np.random.RandomState | None=None, qubits: Sequence[cirq.Qid] | None=None, initial_state: int | cirq.StabilizerStateChForm=0, classical_data: cirq.ClassicalDataStore | None=None)
```

Initializes with the given state and the axes for the operation.

Args:
    qubits: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.
    prng: The pseudo random number generator to use for probabilistic
        effects.
    initial_state: The initial state for the simulation. This can be a
        full CH form passed by reference which will be modified inplace,
        or a big-endian int in the computational basis. If the state is
        an integer, qubits must be provided in order to determine
        array sizes.
    classical_data: The shared classical data container for this
        simulation.

Raises:
    ValueError: If initial state is an integer but qubits are not
        provided.
