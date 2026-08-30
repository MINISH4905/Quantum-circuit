---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/quantum_volume/quantum_volume.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/quantum_volume/quantum_volume.py
license: Apache-2.0
---

## Module `cirq-core/cirq/contrib/quantum_volume/quantum_volume.py`

Utility functions to run the Quantum Volume benchmark defined by IBM in
https://arxiv.org/abs/1811.12926.

## `generate_model_circuit`

```python
def generate_model_circuit(num_qubits: int, depth: int, *, random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> cirq.Circuit
```

Generates a model circuit with the given number of qubits and depth.

The generated circuit consists of `depth` layers of random qubit
permutations followed by random two-qubit gates that are sampled from the
Haar measure on SU(4).

Args:
    num_qubits: The number of qubits in the generated circuit.
    depth: The number of layers in the circuit.
    random_state: Random state or random state seed.

Returns:
    The generated circuit.

## `compute_heavy_set`

```python
def compute_heavy_set(circuit: cirq.Circuit) -> list[int]
```

Classically compute the heavy set of the given circuit.

The heavy set is defined as the output bit-strings that have a greater than
median probability of being generated.

Args:
    circuit: The circuit to classically simulate.

Returns:
    A list containing all of the heavy bit-string results.

## `sample_heavy_set`

```python
def sample_heavy_set(compilation_result: CompilationResult, heavy_set: list[int], *, repetitions=10000, sampler: cirq.Sampler=cirq.Simulator()) -> float
```

Run a sampler over the given circuit and compute the percentage of its
   outputs that are in the heavy set.

Args:
    compilation_result: All the information from the compilation.
    heavy_set: The previously-computed heavy set for the given circuit.
    repetitions: The number of times to sample the circuit.
    sampler: The sampler to run on the given circuit.

Returns:
    A probability percentage, from 0 to 1, representing how many of the
    output bit-strings were in the heavy set.

## `process_results`

```python
def process_results(mapping: dict[cirq.Qid, cirq.Qid], parity_mapping: dict[cirq.Qid, cirq.Qid], trial_result: cirq.Result) -> pd.DataFrame
```

Checks the given results for parity and throws away all of the runs that
don't pass the parity test.

Args:
    mapping: The circuit's mapping from logical qubit to physical qubit.
    parity_mapping: The mapping from result qubit to its parity qubit.
    trial_result: The results to process.

Returns:
    Returns the rows that passed the parity test, with the parity qubit
    measurements removed.

## `compile_circuit`

```python
def compile_circuit(circuit: cirq.Circuit, *, device_graph: nx.Graph, routing_attempts: int, compiler: Callable[[cirq.Circuit], cirq.Circuit] | None=None, routing_algo_name: str | None=None, router: Callable[..., ccr.SwapNetwork] | None=None, add_readout_error_correction=False) -> CompilationResult
```

Compile the given model circuit onto the given device graph. This uses a
different compilation method than described in
https://arxiv.org/pdf/1811.12926.pdf Appendix A. The latter goes through a
7-step process involving various decompositions, routing, and optimization
steps. We route the model circuit and then run a series of optimizers on it
(which can be passed into this function).

Args:
    circuit: The model circuit to compile.
    device_graph: The device graph to compile onto.
    routing_attempts: See doc for calculate_quantum_volume.
    compiler: An optional function to deconstruct the model circuit's
        gates down to the target devices gate set and then optimize it.
    routing_algo_name: The name of the routing algorithm, see ROUTING in
        `route_circuit.py`.
    router: The function that actually does the routing.
    add_readout_error_correction: If true, add some parity bits that will
        later be used to detect readout error.

Returns: A tuple where the first value is the compiled circuit and the
    second value is the final mapping from the model circuit to the compiled
    circuit. The latter is necessary in order to preserve the measurement
    order.

## `QuantumVolumeResult`

```python
class QuantumVolumeResult
```

Stores one run of the results and test information used when running the
quantum volume benchmark so it may be analyzed in detail afterwards.

## `prepare_circuits`

```python
def prepare_circuits(*, num_qubits: int, depth: int, num_circuits: int, random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> list[tuple[cirq.Circuit, list[int]]]
```

Generates circuits and computes their heavy set.

Args:
    num_qubits: The number of qubits in the generated circuits.
    depth: The number of layers in the circuits.
    num_circuits: The number of circuits to create.
    random_state: Random state or random state seed.

Returns:
    A list of tuples where the first element is a generated model
    circuit and the second element is the heavy set for that circuit.

## `execute_circuits`

```python
def execute_circuits(*, device_graph: nx.Graph, samplers: list[cirq.Sampler], circuits: list[tuple[cirq.Circuit, list[int]]], routing_attempts: int, compiler: Callable[[cirq.Circuit], cirq.Circuit] | None=None, repetitions: int=10000, add_readout_error_correction=False) -> list[QuantumVolumeResult]
```

Executes the given circuits on the given samplers.

Args
    device_graph: The device graph to run the compiled circuit on.
    samplers: The samplers to run the algorithm on.
    circuits: The circuits to sample from.
    routing_attempts: See doc for calculate_quantum_volume.
    compiler: An optional function to compiler the model circuit's
        gates down to the target devices gate set and the optimize it.
    repetitions: The number of bitstrings to sample per circuit.
    add_readout_error_correction: If true, add some parity bits that will
        later be used to detect readout error.

Returns:
    A list of QuantumVolumeResults that contains all of the information for
    running the algorithm and its results.

## `calculate_quantum_volume`

```python
def calculate_quantum_volume(*, num_qubits: int, depth: int, num_circuits: int, device_graph: nx.Graph, samplers: list[cirq.Sampler], random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None, compiler: Callable[[cirq.Circuit], cirq.Circuit] | None=None, repetitions=10000, routing_attempts=30, add_readout_error_correction=False) -> list[QuantumVolumeResult]
```

Run the quantum volume algorithm.

This algorithm should compute the same values as Algorithm 1 in
https://arxiv.org/abs/1811.12926. To summarize, we generate a random model
circuit, compute its heavy set, then transpile an implementation onto our
architecture. This implementation is run a series of times and if the
percentage of outputs that are in the heavy set is greater than 2/3, we
consider the quantum volume test passed for that size.

Args:
    num_qubits: The number of qubits for the circuit.
    depth: The number of gate layers to generate.
    num_circuits: The number of random circuits to run.
    random_state: Random state or random state seed.
    device_graph: A graph whose nodes are qubits and edges represent two
        qubit interactions to run the compiled circuit on.
    samplers: The samplers to run the algorithm on.
    compiler: An optional function to compiler the model circuit's
        gates down to the target devices gate set and the optimize it.
    repetitions: The number of bitstrings to sample per circuit.
    routing_attempts: The number of times to route each model circuit onto
        the device. Each attempt will be graded using an ideal simulator
        and the best one will be used.
    add_readout_error_correction: If true, add some parity bits that will
        later be used to detect readout error. WARNING: This makes the
        simulator run extremely slowly for any width/depth of 4 or more,
        because it doubles the circuit size. In reality, the simulator
        shouldn't need to use this larger circuit for the majority of
        operations, since they only come into play at the end.

Returns: A list of QuantumVolumeResults that contains all of the information
    for running the algorithm and its results.
