---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/mux.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/mux.py
license: Apache-2.0
---

## Module `cirq-core/cirq/sim/mux.py`

Sampling/simulation methods that delegate to appropriate simulators.

Filename is a reference to multiplexing.

## `sample`

```python
def sample(program: cirq.Circuit, *, noise: cirq.NOISE_MODEL_LIKE=None, param_resolver: cirq.ParamResolver | None=None, repetitions: int=1, dtype: type[np.complexfloating]=np.complex64, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> cirq.Result
```

Simulates sampling from the given circuit.

Args:
    program: The circuit to sample from.
    noise: Noise model to use while running the simulation.
    param_resolver: Parameters to run with the program.
    repetitions: The number of samples to take.
    dtype: The `numpy.dtype` used by the simulation. Typically one of
        `numpy.complex64` or `numpy.complex128`.
        Favors speed over precision by default, i.e. uses `numpy.complex64`.
    seed: The random seed to use for this simulator.

Returns:
    A `cirq.Result` object containing the requested measurement samples.

## `final_state_vector`

```python
def final_state_vector(program: cirq.CIRCUIT_LIKE, *, initial_state: cirq.STATE_VECTOR_LIKE=0, param_resolver: cirq.ParamResolverOrSimilarType=None, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT, ignore_terminal_measurements: bool=False, dtype: type[np.complexfloating]=np.complex64, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> np.ndarray
```

Returns the state vector resulting from acting operations on a state.

By default the input state is the computational basis zero state, in which
case the output is just the first column of the implied unitary matrix.

Args:
    program: The circuit, gate, operation, or tree of operations
        to apply to the initial state in order to produce the result.
    initial_state: If an int, the state is set to the computational
        basis state corresponding to this state. Otherwise  if this
        is a np.ndarray it is the full initial state. In this case it
        must be the correct size, be normalized (an L2 norm of 1), and
        be safely castable to an appropriate dtype for the simulator.
    param_resolver: Parameters to run with the program.
    qubit_order: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.
    ignore_terminal_measurements: When set, measurements at the end of
        the circuit are ignored instead of causing the method to
        fail.
    dtype: The `numpy.dtype` used by the simulation. Typically one of
        `numpy.complex64` or `numpy.complex128`.
    seed: The random seed to use for this simulator.

Returns:
    The state vector resulting from applying the given unitary operations to
    the desired initial state. Specifically, a numpy array containing the
    amplitudes in np.kron order, where the order of arguments to kron
    is determined by the qubit order argument (which defaults to just
    sorting the qubits that are present into an ascending order).

Raises:
    ValueError: If the program doesn't have a well defined final state because
        it has non-unitary gates.

## `sample_sweep`

```python
def sample_sweep(program: cirq.Circuit, params: cirq.Sweepable, *, noise: cirq.NOISE_MODEL_LIKE=None, repetitions: int=1, dtype: type[np.complexfloating]=np.complex64, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> Sequence[cirq.Result]
```

Runs the supplied Circuit, mimicking quantum hardware.

In contrast to run, this allows for sweeping over different parameter
values.

Args:
    program: The circuit to simulate.
    params: Parameters to run with the program.
    noise: Noise model to use while running the simulation.
    repetitions: The number of repetitions to simulate, per set of
        parameter values.
    dtype: The `numpy.dtype` used by the simulation. Typically one of
        `numpy.complex64` or `numpy.complex128`.
        Favors speed over precision by default, i.e. uses `numpy.complex64`.
    seed: The random seed to use for this simulator.

Returns:
    Result list for this run; one for each possible parameter
    resolver.

## `final_density_matrix`

```python
def final_density_matrix(program: cirq.CIRCUIT_LIKE, *, noise: cirq.NOISE_MODEL_LIKE=None, initial_state: cirq.STATE_VECTOR_LIKE=0, param_resolver: cirq.ParamResolverOrSimilarType=None, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT, dtype: type[np.complexfloating]=np.complex64, seed: int | np.random.RandomState | None=None, ignore_measurement_results: bool=True) -> np.ndarray
```

Returns the density matrix resulting from simulating the circuit.

Note that, unlike `cirq.final_state_vector`, terminal measurements
are not omitted. Instead, all measurements are treated as sources
of decoherence (i.e. measurements do not collapse, they dephase). See
ignore_measurement_results for details.

Args:
    program: The circuit, gate, operation, or tree of operations
        to apply to the initial state in order to produce the result.
    noise: Noise model to use while running the simulation.
    param_resolver: Parameters to run with the program.
    qubit_order: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.
    initial_state: If an int, the state is set to the computational
        basis state corresponding to this state. Otherwise  if this
        is a np.ndarray it is the full initial state. In this case it
        must be the correct size, be normalized (an L2 norm of 1), and
        be safely castable to an appropriate dtype for the simulator.
    dtype: The `numpy.dtype` used by the simulation. Typically one of
        `numpy.complex64` or `numpy.complex128`.
    seed: The random seed to use for this simulator.
    ignore_measurement_results: Defaults to True. When True, the returned
        density matrix is not conditioned on any measurement results.
        For example, this effectively replaces computational basis
        measurement with dephasing noise. The result density matrix in this
        case should be unique. When False, the result will be conditioned on
        sampled (but unreported) measurement results. In this case the
        result may vary from call to call.

Returns:
    The density matrix for the state which results from applying the given
    operations to the desired initial state.
