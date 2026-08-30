---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/density_matrix_simulator.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/density_matrix_simulator.py
license: Apache-2.0
---

## Module `cirq-core/cirq/sim/density_matrix_simulator.py`

Simulator for density matrices that simulates noisy quantum circuits.

## `DensityMatrixSimulator`

```python
class DensityMatrixSimulator(simulator_base.SimulatorBase['cirq.DensityMatrixStepResult', 'cirq.DensityMatrixTrialResult', 'cirq.DensityMatrixSimulationState'], simulator.SimulatesExpectationValues)
```

A simulator for density matrices and noisy quantum circuits.

This simulator can be applied on circuits that are made up of operations
that have:
    * a `_kraus_` method for a Kraus representation of a quantum channel.
    * a `_mixture_` method for a probabilistic combination of unitary gates.
    * a `_unitary_` method for a unitary gate.
    * a `_has_unitary_` and `_apply_unitary_` method.
    * measurements
    * a `_decompose_` that eventually yields one of the above
That is, the circuit must have elements that follow on of the protocols:
    * `cirq.SupportsKraus`
    * `cirq.SupportsMixture`
    * `cirq.SupportsConsistentApplyUnitary`
    * `cirq.SupportsUnitary`
    * `cirq.SupportsDecompose`
or is a measurement.

This simulator supports three types of simulation.

Run simulations which mimic running on actual quantum hardware. These
simulations do not give access to the density matrix (like actual hardware).
There are two variations of run methods, one which takes in a single
(optional) way to resolve parameterized circuits, and a second which
takes in a list or sweep of parameter resolver:

    run(circuit, param_resolver, repetitions)

    run_sweep(circuit, params, repetitions)

These methods return `Result`s which contain both the measurement
results, but also the parameters used for the parameterized
circuit operations. The initial state of a run is always the all 0s state
in the computational basis.

By contrast the simulate methods of the simulator give access to the density
matrix of the simulation at the end of the simulation of the circuit.
Note that if the circuit contains measurements then the density matrix
is that result for those particular measurement results. For example
if there is one measurement, then the simulation may result in the
measurement result for this measurement, and the density matrix will
be that conditional on that result. It will not be the density matrix formed
by summing over the different measurements and their probabilities.
The simulate methods take in two parameters that the run methods do not: a
qubit order and an initial state. The qubit order is necessary because an
ordering must be chosen for the kronecker product (see
`DensityMatrixTrialResult` for details of this ordering). The initial
state can be either the full density matrix, the full wave function (for
pure states), or an integer which represents the initial state of being
in a computational basis state for the binary representation of that
integer. Similar to run methods, there are two simulate methods that run
for single simulations or for sweeps across different parameters:

    simulate(circuit, param_resolver, qubit_order, initial_state)

    simulate_sweep(circuit, params, qubit_order, initial_state)

The simulate methods in contrast to the run methods do not perform
repetitions. The result of these simulations is a
`DensityMatrixTrialResult` which contains, in addition to measurement
results and information about the parameters that were used in the
simulation, access to the density matrix via the `density_matrix` method.

If one wishes to perform simulations that have access to the
density matrix as one steps through running the circuit there is a generator
which can be iterated over and each step is an object that gives access
to the density matrix.  This stepping through a `Circuit` is done on a
`Moment` by `Moment` manner.

    simulate_moment_steps(circuit, param_resolver, qubit_order,
                          initial_state)

One can iterate over the moments with the following
(replace 'sim' with your `Simulator` object):

    for step_result in sim.simulate_moment_steps(circuit):
       # do something with the density matrix via
       # step_result.density_matrix()

### `__init__`

```python
def __init__(self, *, dtype: type[np.complexfloating]=np.complex64, noise: cirq.NOISE_MODEL_LIKE=None, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None, split_untangled_states: bool=True)
```

Density matrix simulator.

Args:
    dtype: The `numpy.dtype` used by the simulation. One of
        `numpy.complex64` or `numpy.complex128`
    noise: A noise model to apply while simulating.
    seed: The random seed to use for this simulator.
    split_untangled_states: If True, optimizes simulation by running
        unentangled qubit sets independently and merging those states
        at the end.

Raises:
    ValueError: If the supplied dtype is not `np.complex64` or
        `np.complex128`.

Example:
   >>> (q0,) = cirq.LineQubit.range(1)
   >>> circuit = cirq.Circuit(cirq.H(q0), cirq.measure(q0))

## `DensityMatrixStepResult`

```python
class DensityMatrixStepResult(simulator_base.StepResultBase['cirq.DensityMatrixSimulationState'])
```

A single step in the simulation of the DensityMatrixSimulator.

Attributes:
    measurements: A dictionary from measurement gate key to measurement
        results, ordered by the qubits that the measurement operates on.

### `__init__`

```python
def __init__(self, sim_state: cirq.SimulationStateBase[cirq.DensityMatrixSimulationState], dtype: type[np.complexfloating]=np.complex64)
```

DensityMatrixStepResult.

Args:
    sim_state: The qubit:SimulationState lookup for this step.
    dtype: The `numpy.dtype` used by the simulation. One of
        `numpy.complex64` or `numpy.complex128`.

### `density_matrix`

```python
def density_matrix(self, copy=True) -> np.ndarray
```

Returns the density matrix at this step in the simulation.

The density matrix that is stored in this result is returned in the
computational basis with these basis states defined by the qubit_map.
In particular the value in the qubit_map is the index of the qubit,
and these are translated into binary vectors where the last qubit is
the 1s bit of the index, the second-to-last is the 2s bit of the index,
and so forth (i.e. big endian ordering). The density matrix is a
`2 ** num_qubits` square matrix, with rows and columns ordered by
the computational basis as just described.

Example:
     qubit_map: {QubitA: 0, QubitB: 1, QubitC: 2}
     Then the returned density matrix will have (row and column) indices
     mapped to qubit basis states like the following table

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
    copy: If True, then the returned state is a copy of the density
        matrix. If False, then the density matrix is not copied,
        potentially saving memory. If one only needs to read derived
        parameters from the density matrix and store then using False
        can speed up simulation by eliminating a memory copy.

## `DensityMatrixTrialResult`

```python
class DensityMatrixTrialResult(simulator_base.SimulationTrialResultBase[density_matrix_simulation_state.DensityMatrixSimulationState])
```

A `SimulationTrialResult` for `DensityMatrixSimulator` runs.

The density matrix that is stored in this result is returned in the
computational basis with these basis states defined by the qubit_map.
In particular, the value in the qubit_map is the index of the qubit,
and these are translated into binary vectors where the last qubit is
the 1s bit of the index, the second-to-last is the 2s bit of the index,
and so forth (i.e. big endian ordering). The density matrix is a
`2 ** num_qubits` square matrix, with rows and columns ordered by
the computational basis as just described.

Example:
     qubit_map: {QubitA: 0, QubitB: 1, QubitC: 2}
     Then the returned density matrix will have (row and column) indices
     mapped to qubit basis states like the following table

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

Attributes:
    params: A ParamResolver of settings used for this result.
    measurements: A dictionary from measurement gate key to measurement
        results. Measurement results are a numpy ndarray of actual boolean
        measurement results (ordered by the qubits acted on by the
        measurement gate.)
    final_simulator_state: The final simulator state of the system after the
        trial finishes.
