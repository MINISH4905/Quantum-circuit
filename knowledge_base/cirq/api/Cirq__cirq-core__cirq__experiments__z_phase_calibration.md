---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/experiments/z_phase_calibration.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/experiments/z_phase_calibration.py
license: Apache-2.0
---

## Module `cirq-core/cirq/experiments/z_phase_calibration.py`

Provides a method to do z-phase calibration for excitation-preserving gates.

## `z_phase_calibration_workflow`

```python
def z_phase_calibration_workflow(sampler: cirq.Sampler, qubits: Sequence[cirq.GridQubit] | None=None, two_qubit_gate: cirq.Gate=ops.CZ, options: xeb_fitting.XEBPhasedFSimCharacterizationOptions | None=None, n_repetitions: int=10 ** 4, n_combinations: int=10, n_circuits: int=20, cycle_depths: Sequence[int]=tuple(np.arange(3, 100, 20)), random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None, atol: float=0.001, num_workers_or_pool: int | multiprocessing.pool.Pool | futures.Executor=-1, pairs: Sequence[tuple[cirq.GridQubit, cirq.GridQubit]] | None=None, tags: Sequence[Any]=()) -> tuple[xeb_fitting.XEBCharacterizationResult, pd.DataFrame]
```

Perform z-phase calibration for excitation-preserving gates.

For a given excitation-preserving two-qubit gate we assume an error model that can be described
using Z-rotations:
            0: ───Rz(a)───two_qubit_gate───Rz(c)───
                            │
            1: ───Rz(b)───two_qubit_gate───Rz(d)───
for some angles a, b, c, and d.

Since the two-qubit gate is a excitation-preserving-gate, it can be represented by an FSimGate
and the effect of rotations turns it into a PhasedFSimGate. Using XEB-data we find the
PhasedFSimGate parameters that minimize the infidelity of the gate.

References:
    - https://arxiv.org/abs/2001.08343
    - https://arxiv.org/abs/2010.07965
    - https://arxiv.org/abs/1910.11333

Args:
    sampler: The quantum engine or simulator to run the circuits.
    qubits: Qubits to use. If none, use all qubits on the sampler's device.
    two_qubit_gate: The entangling gate to use.
    options: The XEB-fitting options. If None, calibrate only the three phase angles
        (chi, gamma, zeta) using the representation of a two-qubit gate as an FSimGate
        for the initial guess.
    n_repetitions: The number of repetitions to use.
    n_combinations: The number of combinations to generate.
    n_circuits: The number of circuits to generate.
    cycle_depths: The cycle depths to use.
    random_state: The random state to use.
    atol: Absolute tolerance to be used by the minimizer.
    num_workers_or_pool: An optional pool or number of workers.
        A zero value means no multiprocessing.
        A positive integer value will create a pool with the given number of workers.
        A negative value will create pool with maximum number of workers.
    pairs: Pairs to use. If not specified, use all pairs between adjacent qubits.
    tags: Tags to add to two qubit operations.
Returns:
    - An `XEBCharacterizationResult` object that contains the calibration result.
    - A `pd.DataFrame` comparing the before and after fidelities.

## `calibrate_z_phases`

```python
def calibrate_z_phases(sampler: cirq.Sampler, qubits: Sequence[cirq.GridQubit] | None=None, two_qubit_gate: cirq.Gate=ops.CZ, options: xeb_fitting.XEBPhasedFSimCharacterizationOptions | None=None, n_repetitions: int=10 ** 4, n_combinations: int=10, n_circuits: int=20, cycle_depths: Sequence[int]=tuple(np.arange(3, 100, 20)), random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None, atol: float=0.001, num_workers_or_pool: int | multiprocessing.pool.Pool | futures.Executor=-1, pairs: Sequence[tuple[cirq.GridQubit, cirq.GridQubit]] | None=None, tags: Sequence[Any]=()) -> dict[tuple[cirq.Qid, cirq.Qid], cirq.PhasedFSimGate]
```

Perform z-phase calibration for excitation-preserving gates.

For a given excitation-preserving two-qubit gate we assume an error model that can be described
using Z-rotations:
            0: ───Rz(a)───two_qubit_gate───Rz(c)───
                            │
            1: ───Rz(b)───two_qubit_gate───Rz(d)───
for some angles a, b, c, and d.

Since the two-qubit gate is a excitation-preserving gate, it can be represented by an FSimGate
and the effect of rotations turns it into a PhasedFSimGate. Using XEB-data we find the
PhasedFSimGate parameters that minimize the infidelity of the gate.

References:
    - https://arxiv.org/abs/2001.08343
    - https://arxiv.org/abs/2010.07965
    - https://arxiv.org/abs/1910.11333

Args:
    sampler: The quantum engine or simulator to run the circuits.
    qubits: Qubits to use. If none, use all qubits on the sampler's device.
    two_qubit_gate: The entangling gate to use.
    options: The XEB-fitting options. If None, calibrate only the three phase angles
        (chi, gamma, zeta) using the representation of a two-qubit gate as an FSimGate
        for the initial guess.
    n_repetitions: The number of repetitions to use.
    n_combinations: The number of combinations to generate.
    n_circuits: The number of circuits to generate.
    cycle_depths: The cycle depths to use.
    random_state: The random state to use.
    atol: Absolute tolerance to be used by the minimizer.
    num_workers_or_pool: An optional multi-processing pool or number of workers.
        A zero value means no multiprocessing.
        A positive integer value will create a pool with the given number of workers.
        A negative value will create pool with maximum number of workers.
    pairs: Pairs to use. If not specified, use all pairs between adjacent qubits.
    tags: Tags to add to two qubit operations.

Returns:
    - A dictionary mapping qubit pairs to the calibrated PhasedFSimGates.

## `plot_z_phase_calibration_result`

```python
def plot_z_phase_calibration_result(before_after_df: pd.DataFrame, axes: np.ndarray[tuple[int, int], np.dtype[np.object_]] | None=None, pairs: Sequence[tuple[cirq.Qid, cirq.Qid]] | None=None, *, with_error_bars: bool=False) -> np.ndarray[tuple[int, int], np.dtype[np.object_]]
```

A helper method to plot the result of running z-phase calibration.

Note that the plotted fidelity is a statistical estimate of the true fidelity and as a result
may be outside the [0, 1] range.

Args:
    before_after_df: The second return object of running `z_phase_calibration_workflow`.
    axes: And ndarray of the axes to plot on.
        The number of axes is expected to be >= number of qubit pairs.
    pairs: If provided, only the given pairs are plotted.
    with_error_bars: Whether to add error bars or not.
        The width of the bar is an upper bound on standard variation of the estimated fidelity.
