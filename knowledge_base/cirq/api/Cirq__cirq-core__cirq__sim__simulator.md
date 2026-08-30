---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/simulator.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/simulator.py
license: Apache-2.0
---

## Module `cirq-core/cirq/sim/simulator.py`

Abstract base classes for different types of simulators.

Simulator types include:

    SimulatesSamples: mimics the interface of quantum hardware.

    SimulatesAmplitudes: computes amplitudes of desired bitstrings in the
        final state of the simulation.

    SimulatesFinalState: allows access to the final state of the simulation.

    SimulatesIntermediateState: allows for access to the state of the simulation
        as the simulation iterates through the moments of a cirq.

## `SimulatesSamples`

```python
class SimulatesSamples(work.Sampler, metaclass=abc.ABCMeta)
```

Simulator that mimics running on quantum hardware.

Implementors of this interface should implement the _run method.

### `run_sweep_iter`

```python
def run_sweep_iter(self, program: cirq.AbstractCircuit, params: cirq.Sweepable, repetitions: int=1) -> Iterator[cirq.Result]
```

Runs the supplied Circuit, mimicking quantum hardware.

In contrast to run, this allows for sweeping over different parameter
values.

Args:
    program: The circuit to simulate.
    params: Parameters to run with the program.
    repetitions: The number of repetitions to simulate.

Returns:
    Result list for this run; one for each possible parameter
    resolver.

Raises:
    ValueError: If the circuit has no measurements.

## `SimulatesAmplitudes`

```python
class SimulatesAmplitudes(metaclass=value.ABCMetaImplementAnyOneOf)
```

Simulator that computes final amplitudes of given bitstrings.

Given a circuit and a list of bitstrings, computes the amplitudes
of the given bitstrings in the state obtained by applying the circuit
to the all zeros state. Implementors of this interface should implement
the compute_amplitudes_sweep_iter method.

### `compute_amplitudes`

```python
def compute_amplitudes(self, program: cirq.AbstractCircuit, bitstrings: Sequence[int], param_resolver: cirq.ParamResolverOrSimilarType=None, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT) -> Sequence[complex]
```

Computes the desired amplitudes.

The initial state is assumed to be the all zeros state.

Args:
    program: The circuit to simulate.
    bitstrings: The bitstrings whose amplitudes are desired, input
        as an integer array where each integer is formed from measured
        qubit values according to `qubit_order` from most to least
        significant qubit, i.e. in big-endian ordering. If inputting
        a binary literal add the prefix 0b or 0B.
        For example: 0010 can be input as 0b0010, 0B0010, 2, 0x2, etc.
    param_resolver: Parameters to run with the program.
    qubit_order: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.

Returns:
    List of amplitudes.

### `compute_amplitudes_sweep`

```python
def compute_amplitudes_sweep(self, program: cirq.AbstractCircuit, bitstrings: Sequence[int], params: cirq.Sweepable, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT) -> Sequence[Sequence[complex]]
```

Wraps computed amplitudes in a list.

Prefer overriding `compute_amplitudes_sweep_iter`.

### `compute_amplitudes_sweep_iter`

```python
def compute_amplitudes_sweep_iter(self, program: cirq.AbstractCircuit, bitstrings: Sequence[int], params: cirq.Sweepable, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT) -> Iterator[Sequence[complex]]
```

Computes the desired amplitudes.

The initial state is assumed to be the all zeros state.

Args:
    program: The circuit to simulate.
    bitstrings: The bitstrings whose amplitudes are desired, input
        as an integer array where each integer is formed from measured
        qubit values according to `qubit_order` from most to least
        significant qubit, i.e. in big-endian ordering. If inputting
        a binary literal add the prefix 0b or 0B.
        For example: 0010 can be input as 0b0010, 0B0010, 2, 0x2, etc.
    params: Parameters to run with the program.
    qubit_order: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.

Returns:
    An Iterator over lists of amplitudes. The outer dimension indexes
    the circuit parameters and the inner dimension indexes bitstrings.

### `sample_from_amplitudes`

```python
def sample_from_amplitudes(self, circuit: cirq.AbstractCircuit, param_resolver: cirq.ParamResolverOrSimilarType, seed: cirq.RANDOM_STATE_OR_SEED_LIKE, repetitions: int=1, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT) -> dict[int, int]
```

Uses amplitude simulation to sample from the given circuit.

This implements the algorithm outlined by Bravyi, Gosset, and Liu in
https://arxiv.org/abs/2112.08499 to more efficiently calculate samples
given an amplitude-based simulator.

Simulators which also implement SimulatesSamples or SimulatesFullState
should prefer `run()` or `simulate()`, respectively, as this method
only accelerates sampling for amplitude-based simulators.

Args:
    circuit: The circuit to simulate.
    param_resolver: Parameters to run with the program.
    seed: Random state to use as a seed. This must be provided
        manually - if the simulator has its own seed, it will not be
        used unless it is passed as this argument.
    repetitions: The number of repetitions to simulate.
    qubit_order: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.

Returns:
    A dict of bitstrings sampled from the final state of `circuit` to
    the number of occurrences of that bitstring.

Raises:
    ValueError: if 'circuit' has non-unitary elements, as differences
        in behavior between sampling steps break this algorithm.

## `SimulatesExpectationValues`

```python
class SimulatesExpectationValues(metaclass=value.ABCMetaImplementAnyOneOf)
```

Simulator that computes exact expectation values of observables.

Given a circuit and an observable map, computes exact (to float precision)
expectation values for each observable at the end of the circuit.

Implementors of this interface should implement the
simulate_expectation_values_sweep_iter method.

### `simulate_expectation_values`

```python
def simulate_expectation_values(self, program: cirq.AbstractCircuit, observables: cirq.PauliSumLike | list[cirq.PauliSumLike], param_resolver: cirq.ParamResolverOrSimilarType=None, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT, initial_state: Any=None, permit_terminal_measurements: bool=False) -> list[float]
```

Simulates the supplied circuit and calculates exact expectation
values for the given observables on its final state.

This method has no perfect analogy in hardware. Instead compare with
Sampler.sample_expectation_values, which calculates estimated
expectation values by sampling multiple times.

Args:
    program: The circuit to simulate.
    observables: An observable or list of observables.
    param_resolver: Parameters to run with the program.
    qubit_order: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.
    initial_state: The initial state for the simulation. The form of
        this state depends on the simulation implementation. See
        documentation of the implementing class for details.
    permit_terminal_measurements: If the provided circuit ends with
        measurement(s), this method will generate an error unless this
        is set to True. This is meant to prevent measurements from
        ruining expectation value calculations.

Returns:
    A list of expectation values, with the value at index `n`
    corresponding to `observables[n]` from the input.

Raises:
    ValueError if 'program' has terminal measurement(s) and
    'permit_terminal_measurements' is False.

### `simulate_expectation_values_sweep`

```python
def simulate_expectation_values_sweep(self, program: cirq.AbstractCircuit, observables: cirq.PauliSumLike | list[cirq.PauliSumLike], params: cirq.Sweepable, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT, initial_state: Any=None, permit_terminal_measurements: bool=False) -> list[list[float]]
```

Wraps computed expectation values in a list.

Prefer overriding `simulate_expectation_values_sweep_iter`.

### `simulate_expectation_values_sweep_iter`

```python
def simulate_expectation_values_sweep_iter(self, program: cirq.AbstractCircuit, observables: cirq.PauliSumLike | list[cirq.PauliSumLike], params: cirq.Sweepable, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT, initial_state: Any=None, permit_terminal_measurements: bool=False) -> Iterator[list[float]]
```

Simulates the supplied circuit and calculates exact expectation
values for the given observables on its final state, sweeping over the
given params.

This method has no perfect analogy in hardware. Instead compare with
Sampler.sample_expectation_values, which calculates estimated
expectation values by sampling multiple times.

Args:
    program: The circuit to simulate.
    observables: An observable or list of observables.
    params: Parameters to run with the program.
    qubit_order: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.
    initial_state: The initial state for the simulation. The form of
        this state depends on the simulation implementation. See
        documentation of the implementing class for details.
    permit_terminal_measurements: If the provided circuit ends in a
        measurement, this method will generate an error unless this
        is set to True. This is meant to prevent measurements from
        ruining expectation value calculations.

Returns:
    An Iterator over expectation-value lists. The outer index determines
    the sweep, and the inner index determines the observable. For
    instance, results[1][3] would select the fourth observable measured
    in the second sweep.

Raises:
    ValueError if 'program' has terminal measurement(s) and
    'permit_terminal_measurements' is False.

## `SimulatesFinalState`

```python
class SimulatesFinalState(Generic[TSimulationTrialResult], metaclass=value.ABCMetaImplementAnyOneOf)
```

Simulator that allows access to the simulator's final state.

Implementors of this interface should implement the simulate_sweep_iter
method. This simulator only returns the state of the quantum system
for the final step of a simulation. This simulator state may be a state
vector, the density matrix, or another representation, depending on the
implementation.  For simulators that also allow stepping through
a circuit see `SimulatesIntermediateState`.

### `simulate`

```python
def simulate(self, program: cirq.AbstractCircuit, param_resolver: cirq.ParamResolverOrSimilarType=None, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT, initial_state: Any=None) -> TSimulationTrialResult
```

Simulates the supplied Circuit.

This method returns a result which allows access to the entire
simulator's final state.

Args:
    program: The circuit to simulate.
    param_resolver: Parameters to run with the program.
    qubit_order: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.
    initial_state: The initial state for the simulation. The form of
        this state depends on the simulation implementation. See
        documentation of the implementing class for details.

Returns:
    SimulationTrialResults for the simulation. Includes the final state.

### `simulate_sweep`

```python
def simulate_sweep(self, program: cirq.AbstractCircuit, params: cirq.Sweepable, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT, initial_state: Any=None) -> list[TSimulationTrialResult]
```

Wraps computed states in a list.

Prefer overriding `simulate_sweep_iter`.

### `simulate_sweep_iter`

```python
def simulate_sweep_iter(self, program: cirq.AbstractCircuit, params: cirq.Sweepable, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT, initial_state: Any=None) -> Iterator[TSimulationTrialResult]
```

Simulates the supplied Circuit.

This method returns a result which allows access to the entire final
simulator state. In contrast to simulate, this allows for sweeping
over different parameter values.

Args:
    program: The circuit to simulate.
    params: Parameters to run with the program.
    qubit_order: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.
    initial_state: The initial state for the simulation. The form of
        this state depends on the simulation implementation. See
        documentation of the implementing class for details.

Returns:
    Iterator over SimulationTrialResults for this run, one for each
    possible parameter resolver.

## `SimulatesIntermediateState`

```python
class SimulatesIntermediateState(Generic[TStepResult, TSimulationTrialResult, TSimulatorState], SimulatesFinalState[TSimulationTrialResult], metaclass=abc.ABCMeta)
```

A SimulatesFinalState that simulates a circuit by moments.

Whereas a general SimulatesFinalState may return the entire simulator
state at the end of a circuit, a SimulatesIntermediateState can
simulate stepping through the moments of a circuit.

Implementors of this interface should implement the _core_iterator
method.

Note that state here refers to simulator state, which is not necessarily
a state vector.

### `simulate_sweep_iter`

```python
def simulate_sweep_iter(self, program: cirq.AbstractCircuit, params: cirq.Sweepable, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT, initial_state: Any=None) -> Iterator[TSimulationTrialResult]
```

Simulates the supplied Circuit.

This method returns a result which allows access to the entire
state vector. In contrast to simulate, this allows for sweeping
over different parameter values.

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

### `simulate_moment_steps`

```python
def simulate_moment_steps(self, circuit: cirq.AbstractCircuit, param_resolver: cirq.ParamResolverOrSimilarType=None, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT, initial_state: Any=None) -> Iterator[TStepResult]
```

Returns an iterator of StepResults for each moment simulated.

If the circuit being simulated is empty, a single step result should
be returned with the state being set to the initial state.

Args:
    circuit: The Circuit to simulate.
    param_resolver: A ParamResolver for determining values of Symbols.
    qubit_order: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.
    initial_state: The initial state for the simulation. This can be
        either a raw state or a `TSimulationState`. The form of the
        raw state depends on the simulation implementation. See
        documentation of the implementing class for details.

Returns:
    Iterator that steps through the simulation, simulating each
    moment and returning a StepResult for each moment.

## `StepResult`

```python
class StepResult(Generic[TSimulatorState], metaclass=abc.ABCMeta)
```

Results of a step of a SimulatesIntermediateState.

Attributes:
    measurements: A dictionary from measurement gate key to measurement
        results, ordered by the qubits that the measurement operates on.

### `sample`

```python
def sample(self, qubits: list[cirq.Qid], repetitions: int=1, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> np.ndarray
```

Samples from the system at this point in the computation.

Note that this does not collapse the state vector.

Args:
    qubits: The qubits to be sampled in an order that influence the
        returned measurement results.
    repetitions: The number of samples to take.
    seed: A seed for the pseudorandom number generator.

Returns:
    Measurement results with True corresponding to the ``|1⟩`` state.
    The outer list is for repetitions, and the inner corresponds to
    measurements ordered by the supplied qubits. These lists
    are wrapped as a numpy ndarray.

### `sample_measurement_ops`

```python
def sample_measurement_ops(self, measurement_ops: list[cirq.GateOperation], repetitions: int=1, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None, *, _allow_repeated=False) -> dict[str, np.ndarray]
```

Samples from the system at this point in the computation.

Note that this does not collapse the state vector.

In contrast to `sample` which samples qubits, this takes a list of
`cirq.GateOperation` instances whose gates are `cirq.MeasurementGate`
instances and then returns a mapping from the key in the measurement
gate to the resulting bit strings. Different measurement operations must
not act on the same qubits.

Args:
    measurement_ops: `GateOperation` instances whose gates are
        `MeasurementGate` instances to be sampled form.
    repetitions: The number of samples to take.
    seed: A seed for the pseudorandom number generator.
    _allow_repeated: If True, adds extra dimension to the result,
        corresponding to the number of times a key is repeated.

Returns: A dictionary from measurement gate key to measurement
    results. Measurement results are stored in a 2-dimensional
    numpy array, the first dimension corresponding to the repetition
    and the second to the actual boolean measurement results (ordered
    by the qubits being measured.)

Raises:
    ValueError: If the operation's gates are not `MeasurementGate`
        instances or a qubit is acted upon multiple times by different
        operations from `measurement_ops`.

## `SimulationTrialResult`

```python
class SimulationTrialResult(Generic[TSimulatorState])
```

Results of a simulation by a SimulatesFinalState.

Unlike `cirq.Result`, a SimulationTrialResult contains the final
simulator_state of the system. This simulator_state is dependent on the
simulation implementation and may be, for example, the state vector
or the density matrix of the system.

Attributes:
    params: A ParamResolver of settings used for this result.
    measurements: A dictionary from measurement gate key to measurement
        results. Measurement results are a numpy ndarray of actual boolean
        measurement results (ordered by the qubits acted on by the
        measurement gate.)

### `__init__`

```python
def __init__(self, params: cirq.ParamResolver, measurements: Mapping[str, np.ndarray], final_simulator_state: TSimulatorState) -> None
```

Initializes the `SimulationTrialResult` class.

Args:
    params: A ParamResolver of settings used for this result.
    measurements: A mapping from measurement gate key to measurement
        results. Measurement results are a numpy ndarray of actual
        boolean measurement results (ordered by the qubits acted on by
        the measurement gate.)
    final_simulator_state: The final simulator state.

### `qubit_map`

```python
def qubit_map(self) -> Mapping[cirq.Qid, int]
```

A map from Qid to index used to define the ordering of the basis in
the result.

## `check_all_resolved`

```python
def check_all_resolved(circuit) -> None
```

Raises if the circuit contains unresolved symbols.

## `split_into_matching_protocol_then_general`

```python
def split_into_matching_protocol_then_general(circuit: cirq.AbstractCircuit, predicate: Callable[[cirq.Operation], bool]) -> tuple[cirq.AbstractCircuit, cirq.AbstractCircuit]
```

Splits the circuit into a matching prefix and non-matching suffix.

The splitting happens in a per-qubit fashion. A non-matching operation on
qubit A will cause later operations on A to be part of the non-matching
suffix, but later operations on other qubits will continue to be put into
the matching part (as long as those qubits have had no non-matching operation
up to that point). Measurement keys are handled equivalently.
