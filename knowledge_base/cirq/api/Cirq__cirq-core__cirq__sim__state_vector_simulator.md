---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/state_vector_simulator.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/state_vector_simulator.py
license: Apache-2.0
---

## Module `cirq-core/cirq/sim/state_vector_simulator.py`

Abstract classes for simulations which keep track of state vector.

## `SimulatesIntermediateStateVector`

```python
class SimulatesIntermediateStateVector(Generic[TStateVectorStepResult], simulator_base.SimulatorBase[TStateVectorStepResult, 'cirq.StateVectorTrialResult', 'cirq.StateVectorSimulationState'], simulator.SimulatesAmplitudes, metaclass=abc.ABCMeta)
```

A simulator that accesses its state vector as it does its simulation.

Implementors of this interface should implement the _core_iterator
method.

## `StateVectorTrialResult`

```python
class StateVectorTrialResult(state_vector.StateVectorMixin, simulator_base.SimulationTrialResultBase['cirq.StateVectorSimulationState'])
```

A `SimulationTrialResult` that includes the `StateVectorMixin` methods.

Attributes:
    final_state_vector: The final state vector for the system.

### `state_vector`

```python
def state_vector(self, copy: bool=False) -> np.ndarray
```

Return the state vector at the end of the computation.

The state is returned in the computational basis with these basis
states defined by the qubit_map. In particular the value in the
qubit_map is the index of the qubit, and these are translated into
binary vectors where the last qubit is the 1s bit of the index, the
second-to-last is the 2s bit of the index, and so forth (i.e. big
endian ordering).

Example:
     qubit_map: {QubitA: 0, QubitB: 1, QubitC: 2}
     Then the returned vector will have indices mapped to qubit basis
     states like the following table

        |     | QubitA | QubitB | QubitC |
        | :-: | :----: | :----: | :----: |
        |  0  |   0    |   0    |   0    |
        |  1  |   0    |   0    |   1    |
        |  2  |   0    |   1    |   0    |
        |  3  |   0    |   1    |   1    |
        |  4  |   1    |   0    |   0    |
        |  5  |   1    |   0    |   1    |
        |  6  |   1    |   1    |   0    |
        |  7  |   1    |   1    |   1    |

Args:
    copy: If True, the returned state vector will be a copy of that
    stored by the object. This is potentially expensive for large
    state vectors, but prevents mutation of the object state, e.g. for
    operating on intermediate states of a circuit.
    Defaults to False.
