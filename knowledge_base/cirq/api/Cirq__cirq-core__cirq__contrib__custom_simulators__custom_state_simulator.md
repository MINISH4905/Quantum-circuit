---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/custom_simulators/custom_state_simulator.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/custom_simulators/custom_state_simulator.py
license: Apache-2.0
---

## `CustomStateStepResult`

```python
class CustomStateStepResult(sim.StepResultBase[TSimulationState], Generic[TSimulationState])
```

The step result provided by `CustomStateSimulator.simulate_moment_steps`.

## `CustomStateTrialResult`

```python
class CustomStateTrialResult(sim.SimulationTrialResultBase[TSimulationState], Generic[TSimulationState])
```

The trial result provided by `CustomStateSimulator.simulate`.

## `CustomStateSimulator`

```python
class CustomStateSimulator(sim.SimulatorBase[CustomStateStepResult[TSimulationState], CustomStateTrialResult[TSimulationState], TSimulationState], Generic[TSimulationState])
```

A simulator that can be used to simulate custom states.

### `__init__`

```python
def __init__(self, state_type: type[TSimulationState], *, noise: cirq.NOISE_MODEL_LIKE=None, split_untangled_states: bool=False)
```

Initializes a CustomStateSimulator.

Args:
    state_type: The class that represents the simulation state this simulator should use.
    noise: The noise model used by the simulator.
    split_untangled_states: True to run the simulation as a product state. This is only
        supported if the `state_type` supports it via an implementation of `kron` and
        `factor` methods. Otherwise a runtime error will occur during simulation.
