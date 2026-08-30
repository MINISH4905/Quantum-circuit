---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/simulator_base.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/simulator_base.py
license: Apache-2.0
---

## Module `cirq-core/cirq/sim/simulator_base.py`

Batteries-included class for Cirq's built-in simulators.

## `SimulatorBase`

```python
class SimulatorBase(Generic[TStepResultBase, TSimulationTrialResult, TSimulationState], SimulatesIntermediateState[TStepResultBase, TSimulationTrialResult, SimulationStateBase[TSimulationState]], SimulatesSamples, metaclass=abc.ABCMeta)
```

A base class for the built-in simulators.

Most implementors of this interface should implement the
`_create_partial_simulation_state` and `_create_step_result` methods. The
first one creates the simulator's quantum state representation at the
beginning of the simulation. The second creates the step result emitted
after each `Moment` in the simulation.

Iteration in the subclass is handled by the `_core_iterator` implementation
here, which handles moment stepping, application of operations, measurement
collection, and creation of noise. Simulators with more advanced needs can
override the implementation if necessary.

Sampling is handled by the implementation of `_run`. This implementation
iterates the circuit to create a final step result, and samples that
result when possible. If not possible, due to noise or classical
probabilities on a state vector, the implementation attempts to fully
iterate the unitary prefix once, then only repeat the non-unitary
suffix from copies of the state obtained by the prefix. If more advanced
functionality is required, then the `_run` method can be overridden.

Note that state here refers to simulator state, which is not necessarily
a state vector. The included simulators and corresponding states are state
vector, density matrix, Clifford, and MPS. Each of these use the default
`_core_iterator` and `_run` methods.

### `__init__`

```python
def __init__(self, *, dtype: type[np.complexfloating]=np.complex64, noise: cirq.NOISE_MODEL_LIKE=None, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None, split_untangled_states: bool=False)
```

Initializes the simulator.

Args:
    dtype: The `numpy.dtype` used by the simulation.
    noise: A noise model to apply while simulating.
    seed: The random seed to use for this simulator.
    split_untangled_states: If True, optimizes simulation by running
        unentangled qubit sets independently and merging those states
        at the end.

### `simulate_sweep_iter`

```python
def simulate_sweep_iter(self, program: cirq.AbstractCircuit, params: cirq.Sweepable, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT, initial_state: Any=None) -> Iterator[TSimulationTrialResult]
```

Simulates the supplied Circuit.

This particular implementation overrides the base implementation such
that an unparameterized prefix circuit is simulated and fed into the
parameterized suffix circuit.

Args:
    program: The circuit to simulate.
    params: Parameters to run with the program.
    qubit_order: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.
    initial_state: The initial state for the simulation. This can be
        either a raw state or an `SimulationStateBase`. The form of the
        raw state depends on the simulation implementation. See
        documentation of the implementing class for details.

Returns:
    List of SimulationTrialResults for this run, one for each
    possible parameter resolver.

## `StepResultBase`

```python
class StepResultBase(Generic[TSimulationState], StepResult[SimulationStateBase[TSimulationState]], abc.ABC)
```

A base class for step results.

### `__init__`

```python
def __init__(self, sim_state: SimulationStateBase[TSimulationState])
```

Initializes the step result.

Args:
    sim_state: The `SimulationStateBase` for this step.

## `SimulationTrialResultBase`

```python
class SimulationTrialResultBase(SimulationTrialResult[SimulationStateBase[TSimulationState]], Generic[TSimulationState], abc.ABC)
```

A base class for trial results.

### `__init__`

```python
def __init__(self, params: study.ParamResolver, measurements: dict[str, np.ndarray], final_simulator_state: cirq.SimulationStateBase[TSimulationState]) -> None
```

Initializes the `SimulationTrialResultBase` class.

Args:
    params: A ParamResolver of settings used for this result.
    measurements: A dictionary from measurement gate key to measurement
        results. Measurement results are a numpy ndarray of actual
        boolean measurement results (ordered by the qubits acted on by
        the measurement gate.)
    final_simulator_state: The final simulator state of the system after the
        trial finishes.

### `get_state_containing_qubit`

```python
def get_state_containing_qubit(self, qubit: cirq.Qid) -> TSimulationState
```

Returns the independent state space containing the qubit.

Args:
    qubit: The qubit whose state space is required.

Returns:
    The state space containing the qubit.
