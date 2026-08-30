---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/shuffle_circuits/shuffle_circuits_with_readout_benchmarking.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/shuffle_circuits/shuffle_circuits_with_readout_benchmarking.py
license: Apache-2.0
---

## Module `cirq-core/cirq/contrib/shuffle_circuits/shuffle_circuits_with_readout_benchmarking.py`

Tools for running circuits in a shuffled order with readout error benchmarking.

## `ReadoutBenchmarkingParams`

```python
class ReadoutBenchmarkingParams
```

Parameters for configuring readout benchmarking.

Attributes:
    circuit_repetitions: The repetitions for `circuits`.
    num_random_bitstrings: The number of random bitstrings for measuring readout.
        If set to 0, no readout calibration circuits are generated.
    readout_repetitions: The number of repetitions for each readout bitstring.

## `run_shuffled_with_readout_benchmarking`

```python
def run_shuffled_with_readout_benchmarking(input_circuits: list[circuits.Circuit], sampler: work.Sampler, circuit_repetitions: int | list[int], rng_or_seed: np.random.Generator | int, num_random_bitstrings: int=100, readout_repetitions: int=1000, qubits: Sequence[ops.Qid] | Sequence[Sequence[ops.Qid]] | None=None) -> tuple[Sequence[ResultDict], dict[tuple[ops.Qid, ...], SingleQubitReadoutCalibrationResult]]
```

Run the circuits in a shuffled order with readout error benchmarking.

Args:
    input_circuits: The circuits to run.
    sampler: The sampler to use.
    circuit_repetitions: The repetitions for `circuits`.
    rng_or_seed: A random number generator used to generate readout circuits.
                 Or an integer seed.
    num_random_bitstrings: The number of random bitstrings for measuring readout.
        If set to 0, no readout calibration circuits are generated.
    readout_repetitions: The number of repetitions for each readout bitstring.
    qubits: The qubits to benchmark readout errors. If None, all qubits in the
            input_circuits are used. Can be a list of qubits or a list of tuples
            of qubits.

Returns:
    A tuple containing:
    - A list of dictionaries with the unshuffled measurement results.
    - A dictionary mapping each tuple of qubits to a SingleQubitReadoutCalibrationResult.

## `run_shuffled_circuits_with_readout_benchmarking`

```python
def run_shuffled_circuits_with_readout_benchmarking(sampler: work.Sampler, input_circuits: list[circuits.Circuit], parameters: ReadoutBenchmarkingParams, qubits: Sequence[ops.Qid] | Sequence[Sequence[ops.Qid]] | None=None, rng_or_seed: np.random.Generator | int | None=None) -> tuple[Sequence[ResultDict], dict[tuple[ops.Qid, ...], SingleQubitReadoutCalibrationResult]]
```

Run the circuits in a shuffled order with readout error benchmarking.

Args:
    sampler: The sampler to use.
    input_circuits: The circuits to run.
    parameters: The readout benchmarking parameters.
    qubits: The qubits to benchmark readout errors. If None, all qubits in the
            input_circuits are used. Can be a list of qubits or a list of tuples
            of qubits.
    rng_or_seed: A random number generator used to generate readout circuits.
                 Or an integer seed.

Returns:
    A tuple containing:
    - A list of dictionaries with the unshuffled measurement results.
    - A dictionary mapping each tuple of qubits to a SingleQubitReadoutCalibrationResult.

## `run_sweep_with_readout_benchmarking`

```python
def run_sweep_with_readout_benchmarking(sampler: work.Sampler, input_circuits: list[circuits.Circuit], sweep_params: Sequence[study.Sweepable], parameters: ReadoutBenchmarkingParams, qubits: Sequence[ops.Qid] | Sequence[Sequence[ops.Qid]] | None=None, rng_or_seed: np.random.Generator | int | None=None) -> tuple[Sequence[Sequence[study.Result]], dict[tuple[ops.Qid, ...], SingleQubitReadoutCalibrationResult]]
```

Run the sweep circuits with readout error benchmarking (no shuffling).
Args:
    sampler: The sampler to use.
    input_circuits: The circuits to run.
    sweep_params: The sweep parameters for the input circuits.
    parameters: The readout benchmarking parameters.
    qubits: The qubits to benchmark readout errors. If None, all qubits in the
    input_circuits are used. Can be a list of qubits or a list of tuples
    of qubits.
    rng_or_seed: A random number generator used to generate readout circuits.
                 Or an integer seed.

Returns:
    A tuple containing:
    - A list of lists of dictionaries with the measurement results.
    - A dictionary mapping each tuple of qubits to a SingleQubitReadoutCalibrationResult.
