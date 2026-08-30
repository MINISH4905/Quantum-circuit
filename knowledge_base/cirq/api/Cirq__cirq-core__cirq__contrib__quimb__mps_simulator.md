---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/quimb/mps_simulator.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/quimb/mps_simulator.py
license: Apache-2.0
---

## Module `cirq-core/cirq/contrib/quimb/mps_simulator.py`

An MPS simulator.

This is based on this paper:
https://arxiv.org/abs/2002.07730

## `MPSSimulator`

```python
class MPSSimulator(simulator_base.SimulatorBase['MPSSimulatorStepResult', 'MPSTrialResult', 'MPSState'])
```

An efficient simulator for MPS circuits.

### `__init__`

```python
def __init__(self, noise: cirq.NOISE_MODEL_LIKE=None, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None, simulation_options: MPSOptions=MPSOptions(), grouping: dict[cirq.Qid, int] | None=None)
```

Creates instance of `MPSSimulator`.

Args:
    noise: A noise model to apply while simulating.
    seed: The random seed to use for this simulator.
    simulation_options: Numerical options for the simulation.
    grouping: How to group qubits together, if None all are individual.

Raises:
    ValueError: If the noise model is not unitary or a mixture.

## `MPSTrialResult`

```python
class MPSTrialResult(simulator_base.SimulationTrialResultBase['MPSState'])
```

A single trial result

## `MPSSimulatorStepResult`

```python
class MPSSimulatorStepResult(simulator_base.StepResultBase['MPSState'])
```

A `StepResult` that can perform measurements.

### `__init__`

```python
def __init__(self, sim_state: cirq.SimulationStateBase[MPSState])
```

Results of a step of the simulator.
Attributes:
    sim_state: The qubit:SimulationState lookup for this step.

## `MPSState`

```python
class MPSState(SimulationState[_MPSHandler])
```

A state of the MPS simulation.

### `__init__`

```python
def __init__(self, *, qubits: Sequence[cirq.Qid], prng: np.random.RandomState, simulation_options: MPSOptions=MPSOptions(), grouping: dict[cirq.Qid, int] | None=None, initial_state: int=0, classical_data: cirq.ClassicalDataStore | None=None)
```

Creates and MPSState

Args:
    qubits: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.
    prng: A random number generator, used to simulate measurements.
    simulation_options: Numerical options for the simulation.
    grouping: How to group qubits together, if None all are individual.
    initial_state: An integer representing the initial state.
    classical_data: The shared classical data container for this
        simulation.

Raises:
    ValueError: If the grouping does not cover the qubits.

### `state_vector`

```python
def state_vector(self) -> np.ndarray
```

Returns the full state vector.

Returns:
    A vector that contains the full state.

### `partial_trace`

```python
def partial_trace(self, keep_qubits: set[cirq.Qid]) -> np.ndarray
```

Traces out all qubits except keep_qubits.

Args:
    keep_qubits: The set of qubits that are left after computing the
        partial trace. For example, if we have a circuit for 3 qubits
        and this parameter only has one qubit, the entire density matrix
        would be 8x8, but this function returns a 2x2 matrix.

Returns:
    An array that contains the partial trace.

### `to_numpy`

```python
def to_numpy(self) -> np.ndarray
```

An alias for the state vector.

### `estimation_stats`

```python
def estimation_stats(self) -> dict[str, float]
```

Returns some statistics about the memory usage and quality of the approximation.
