---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/classical_simulator.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/classical_simulator.py
license: Apache-2.0
---

## `ClassicalBasisState`

```python
class ClassicalBasisState(qis.QuantumStateRepresentation)
```

Represents a classical basis state for efficient state evolution.

### `__init__`

```python
def __init__(self, initial_state: list[int] | np.ndarray)
```

Initializes the ClassicalBasisState object.

Args:
    initial_state: The initial state in the computational basis.

### `copy`

```python
def copy(self, deep_copy_buffers: bool=True) -> ClassicalBasisState
```

Creates a copy of the ClassicalBasisState object.

Args:
    deep_copy_buffers: Whether to deep copy the internal buffers.
Returns:
    A copy of the ClassicalBasisState object.

### `measure`

```python
def measure(self, axes: Sequence[int], seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> list[int]
```

Measures the density matrix.

Args:
    axes: The axes to measure.
    seed: The random number seed to use.
Returns:
    The measurements in order.

## `ClassicalBasisSimState`

```python
class ClassicalBasisSimState(SimulationState[ClassicalBasisState])
```

Represents the state of a quantum simulation using classical basis states.

### `__init__`

```python
def __init__(self, initial_state: int | Sequence[int]=0, qubits: Sequence[cirq.Qid] | None=None, classical_data: cirq.ClassicalDataStore | None=None)
```

Initializes the ClassicalBasisSimState object.

Args:
    qubits: The qubits to simulate.
    initial_state: The initial state for the simulation. Accepts int or Sequence[int].
    classical_data: The classical data container for the simulation.

Raises:
    ValueError: If qubits not provided and initial_state is int.
        If initial_state is not an int or Sequence[int].
        If initial_state is a np.ndarray and its shape is not 1-dimensional.

An initial_state value of type integer is parsed in big endian order.

## `ClassicalStateStepResult`

```python
class ClassicalStateStepResult(sim.StepResultBase['ClassicalBasisSimState'], Generic[TSimulationState])
```

The step result provided by `ClassicalStateSimulator.simulate_moment_steps`.

## `ClassicalStateTrialResult`

```python
class ClassicalStateTrialResult(sim.SimulationTrialResultBase['ClassicalBasisSimState'], Generic[TSimulationState])
```

The trial result provided by `ClassicalStateSimulator.simulate`.

## `ClassicalStateSimulator`

```python
class ClassicalStateSimulator(sim.SimulatorBase[ClassicalStateStepResult['ClassicalBasisSimState'], ClassicalStateTrialResult['ClassicalBasisSimState'], 'ClassicalBasisSimState'], Generic[TSimulationState])
```

A simulator that accepts only gates with classical counterparts.

### `__init__`

```python
def __init__(self, *, noise: cirq.NOISE_MODEL_LIKE=None, split_untangled_states: bool=False)
```

Initializes a ClassicalStateSimulator.

Args:
    noise: The noise model used by the simulator.
    split_untangled_states: Whether to run the simulation as a product state.

Raises:
    ValueError: If noise_model is not None.
