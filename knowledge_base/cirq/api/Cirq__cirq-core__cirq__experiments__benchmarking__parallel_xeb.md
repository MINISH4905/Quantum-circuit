---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/experiments/benchmarking/parallel_xeb.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/experiments/benchmarking/parallel_xeb.py
license: Apache-2.0
---

## Module `cirq-core/cirq/experiments/benchmarking/parallel_xeb.py`

A module for performing and analysing parallel XEB.

## `XEBParameters`

```python
class XEBParameters
```

A frozen dataclass that holds the parameter of an XEB experiment.

Attributes:
    n_repetitions: The number of repetitions to use.
    n_combinations: The number of combinations to generate.
    n_circuits: The number of circuits to generate.
    cycle_depths: The cycle depths to use.

## `XEBWideCircuitInfo`

```python
class XEBWideCircuitInfo
```

Represents an XEB circuit expanded to the given cycle depth.

Attributes:
    wide_circuit: The expanded circuit.
    pairs: A list of the pairs benchmarked by the given circuit.
    narrow_template_indices: Integer indices of the circuits in the narrow circuit library
        used to build the given wide circuit.
    cycle_depth: Optional, the depth of the cycle forming the wide circuit.

### `from_narrow_circuits`

```python
def from_narrow_circuits(circuit_templates: Sequence[cirq.Circuit], permutation: np.ndarray, pairs: Sequence[_QUBIT_PAIR_T], target: _CANONICAL_TARGET_T) -> XEBWideCircuitInfo
```

A static method that merges a sequence of narrow circuits into a wide circuit.

Args:
    circuit_templates: A sequence of 2Q (i.e. narrow) circuits.
    permutation: A permutation that maps a qubit-pair to a narrow circuit.
    pairs: The list of qubit-pairs to benchmark.
    target: The target 2Q operation to benchmark.

Returns:
    An XEBWideCircuitInfo instance representing the glued circuits.

### `sliced_circuits`

```python
def sliced_circuits(self, cycle_depths: Sequence[int]) -> Sequence[XEBWideCircuitInfo]
```

Slices the wide circuit into the given cycle depths and appends necessary measurements.

Args:
    cycle_depths: the cycle depths to cut the wide circuit into.

Returns:
    A sequence of XEBWideCircuitInfo representing the sliced circuits.

## `create_combination_circuits`

```python
def create_combination_circuits(circuit_templates: Sequence[cirq.Circuit], combinations_by_layer: Sequence[rqcg.CircuitLibraryCombination], target: _CANONICAL_TARGET_T) -> Sequence[XEBWideCircuitInfo]
```

Zips two-qubit circuits into a single wide circuit for each of the given combinations.

Args:
    circuit_templates: A sequence of narrow circuits.
    combinations_by_layer: A sequence of combinations.
    target: The target 2Q operation.

Returns:
    A sequence of XEBWideCircuitInfo representing the wide circuits.

## `simulate_circuit`

```python
def simulate_circuit(simulator: cirq.Simulator, circuit: cirq.Circuit, cycle_depths: Sequence[int]) -> Sequence[np.ndarray]
```

Simulates the given circuit and returns the state probabilities for each cycle depth.

Args:
    simulator: A cirq simulator.
    circuit: The circuit to simulate.
    cycle_depths: A sequence of integers representing the depths for which we need the
        state probabilities.

Returns:
    - The cuircuit_id, same as given in input.
    - The state probabilities for each cycle depth.

## `simulate_circuit_library`

```python
def simulate_circuit_library(circuit_templates: Sequence[cirq.Circuit], target_or_dict: _CANONICAL_TARGET_T, cycle_depths: Sequence[int], pool: futures.Executor | None=None) -> Sequence[Sequence[np.ndarray]] | Mapping[_QUBIT_PAIR_T, Sequence[Sequence[np.ndarray]]]
```

Simulate the given sequence of circuits.

Args:
    circuit_templates: A sequence of circuits to simulate.
    target_or_dict: The target operation or dictionary mapping qubit-pairs to operations.
    cycle_depths: A list of integers giving the cycle depths to use in benchmarking.
    pool: An optional concurrent.futures.Executor pool (e.g. ThreadPoolExecutor).
        If given, the simulations are performed asynchronously.

Returns:
    If target_or_dict is an operation:
        A sequence of the result of simulate_circuit for each circuit_templates.
    Else:
        A dictionary mapping the keys of the map to a sequence of the result of
        simulate_circuit for each circuit_templates.

## `sample_all_circuits`

```python
def sample_all_circuits(sampler: cirq.Sampler, circuits: Sequence[cirq.Circuit], repetitions: int) -> Sequence[dict[str, np.ndarray]]
```

Calls sampler.run_batch on the given circuits and estimates the state probabilities.

Args:
    sampler: A cirq sampler.
    circuits: A sequence of circuits.
    repetitions: An integer, the number of sampling repetitions.

Returns:
    For each circuit, a dictionary mapping measurement keys to the estimated probabilities.

## `XEBFidelity`

```python
class XEBFidelity
```

The estimated fidelity of a given pair at a give cycle depth.

Attributes:
    pair: A qubit pair.
    cycle_depth: The depth of the cycle.
    fidelity: The estimated fidelity.

## `estimate_fidelities`

```python
def estimate_fidelities(sampling_results: Sequence[dict[str, np.ndarray]], simulation_results: Sequence[Sequence[np.ndarray]] | Mapping[_QUBIT_PAIR_T, Sequence[Sequence[np.ndarray]]], cycle_depths: Sequence[int], wide_circuits_info: Sequence[XEBWideCircuitInfo], pairs: Sequence[_QUBIT_PAIR_T], num_templates: int) -> Sequence[XEBFidelity]
```

Estimates the fidelities from the given sampling and simulation results.

Args:
    sampling_results: The result of `sample_all_circuits`.
    simulation_results: The result of `simulate_circuit_library`,
    cycle_depths: The sequence of cycle depths,
    wide_circuits_info: Sequence of XEBWideCircuitInfo detailing describing
        the sampled circuits.
    pairs: The qubit pairs being tests,
    num_templates: The number of circuit templates used for benchmarking,

Returns:
    A sequence of XEBFidelity objects.

## `parallel_xeb_workflow`

```python
def parallel_xeb_workflow(sampler: cirq.Sampler, target: _TARGET_T | Mapping[_QUBIT_PAIR_T, _TARGET_T], ideal_target: _TARGET_T | Mapping[_QUBIT_PAIR_T, _TARGET_T] | None=None, qubits: Sequence[cirq.GridQubit] | None=None, pairs: Sequence[_QUBIT_PAIR_T] | None=None, parameters: XEBParameters=XEBParameters(), rng: np.random.Generator | None=None, pool: futures.Executor | None=None) -> Sequence[XEBFidelity]
```

A utility method that runs the full XEB workflow.

Args:
    sampler: The quantum engine or simulator to run the circuits.
    target: The entangling gate, op, circuit or dict mapping pairs to ops.
    ideal_target: The ideal target(s) to branch mark against. If None, use `target`.
    qubits: Qubits under test. If None, uses all qubits on the sampler's device.
    pairs: Pairs to use. If not specified, use all pairs between adjacent qubits.
    parameters: An `XEBParameters` containing the parameters of the XEB experiment.
    rng: The random number generator to use.
    pool: An optional `concurrent.futures.Executor` pool.

Returns:
    A sequence of XEBFidelity listing the estimated fidelity for each qubit_pair per depth.

Raises:
    ValueError: If qubits are not specified and the sampler has no device.

## `parallel_two_qubit_xeb`

```python
def parallel_two_qubit_xeb(sampler: cirq.Sampler, target: _TARGET_T | Mapping[_QUBIT_PAIR_T, _TARGET_T], ideal_target: _TARGET_T | Mapping[_QUBIT_PAIR_T, _TARGET_T] | None=None, qubits: Sequence[cirq.GridQubit] | None=None, pairs: Sequence[_QUBIT_PAIR_T] | None=None, parameters: XEBParameters=XEBParameters(), rng: np.random.Generator | None=None, pool: futures.Executor | None=None) -> tqxeb.TwoQubitXEBResult
```

A convenience method that runs the full XEB workflow.

Args:
    sampler: The quantum engine or simulator to run the circuits.
    target: The entangling gate, op, circuit or dict mapping pairs to ops.
    ideal_target: The ideal target(s) to branch mark against. If None, use `target`.
    qubits: Qubits under test. If None, uses all qubits on the sampler's device.
    pairs: Pairs to use. If not specified, use all pairs between adjacent qubits.
    parameters: An `XEBParameters` containing the parameters of the XEB experiment.
    rng: The random number generator to use.
    pool: An optional `concurrent.futures.Executor` pool.

Returns:
    A `TwoQubitXEBResult` object representing the result.

Raises:
    ValueError: If qubits are not specified and the sampler has no device.
