---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/simulation_product_state.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/simulation_product_state.py
license: Apache-2.0
---

## `SimulationProductState`

```python
class SimulationProductState(Generic[TSimulationState], SimulationStateBase[TSimulationState], abc.Mapping)
```

A container for a `Qid`-to-`SimulationState` dictionary.

### `__init__`

```python
def __init__(self, sim_states: dict[cirq.Qid | None, TSimulationState], qubits: Sequence[cirq.Qid], split_untangled_states: bool, classical_data: cirq.ClassicalDataStore | None=None)
```

Initializes the class.

Args:
    sim_states: The `SimulationState` dictionary. This will not be
        copied; the original reference will be kept here.
    qubits: The canonical ordering of qubits.
    split_untangled_states: If True, optimizes operations by running
        unentangled qubit sets independently and merging those states
        at the end.
    classical_data: The shared classical data container for this
        simulation.
