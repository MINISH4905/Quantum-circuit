---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/paulistring/pauli_string_measurement_with_readout_mitigation.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/paulistring/pauli_string_measurement_with_readout_mitigation.py
license: Apache-2.0
---

## Module `cirq-core/cirq/contrib/paulistring/pauli_string_measurement_with_readout_mitigation.py`

Tools for measuring expectation values of Pauli strings with readout error mitigation.

## `CircuitToPauliStringsParameters`

```python
class CircuitToPauliStringsParameters
```

Parameters for measuring Pauli strings on a circuit.

If postselection symmetries are provided, this circuit will be measured using
the post-selection symmetry method. If no postselection symmetries are provided,
this circuit will be measured using the confusion matrix method.

Attributes:
    circuit: The circuit to measure.
    pauli_strings: The tuple of QWC groups (tuple[tuple[ops.PauliString, ...], ...]).
        Each QWC group is a tuple of PauliStrings that are mutually Qubit-Wise Commuting.
        Pauli strings within the same group will be calculated using the same measurement
        results.
    postselection_symmetries: The tuple mapping Pauli strings or Pauli sums to expected values
        for postselection symmetries.  Measured bitstrings which do not have the indicated
        values of the symmetry operators are postselected out.

## `PostFilteringSymmetryCalibrationResult`

```python
class PostFilteringSymmetryCalibrationResult
```

Result of post-selection symmetry calibration.
Attributes:
    raw_bitstrings: The raw bitstrings obtained from the measurement.
    filtered_bitstrings: The bitstrings after applying post-selection symmetries.

## `PauliStringMeasurementResult`

```python
class PauliStringMeasurementResult
```

Result of measuring a Pauli string.

Attributes:
    pauli_string: The Pauli string that is measured.
    mitigated_expectation: The error-mitigated expectation value of the Pauli string.
    mitigated_stddev: The standard deviation of the error-mitigated expectation value.
    unmitigated_expectation: The unmitigated expectation value of the Pauli string.
    unmitigated_stddev: The standard deviation of the unmitigated expectation value.
    calibration_result: The calibration result for readout errors. It can be either
       a SingleQubitReadoutCalibrationResult (in the case of mitigating with confusion
       matrices) or a PostFilteringSymmetryCalibrationResult (in the case of mitigating
       with post-selection symmetries).

## `CircuitToPauliStringsMeasurementResult`

```python
class CircuitToPauliStringsMeasurementResult
```

Result of measuring Pauli strings on a circuit.

Attributes:
    circuit: The circuit that is measured.
    results: A list of PauliStringMeasurementResult objects.

## `TRexMetadata`

```python
class TRexMetadata
```

Metadata required to compute T-REX mitigated expectation values later.

Attributes:
    pauli_str: The Pauli string that is being measured.
    twirl_choices: A 2D boolean array of shape (num_twirls, num_qubits) indicating
        the random twirl choices. The column indices correspond to the target
        qubits in sorted order (i.e., `sorted(pauli_str.qubits)`).
    readout_choices: A 2D boolean array of shape (num_readout_circuits, num_qubits)
        indicating the random choices for generating readout calibration circuits.
        As with `twirl_choices`, the column indices correspond to the target qubits
        in sorted order.

## `generate_trex_and_readout_circuits`

```python
def generate_trex_and_readout_circuits(circuit_to_pauli: CircuitToPauliStringsParameters, num_twirls: int, num_readout_circuits: int, rng: np.random.Generator) -> tuple[list[circuits.Circuit], TRexMetadata]
```

Generates a list of circuits for TREX benchmarking and readout calibration.

This function generates `num_twirls` circuits by applying random Pauli twirls
to the input circuit. It also generates `num_readout_circuits` for readout
error calibration. Each circuit is appended with measurement operations on the
targeted qubits.

Args:
    circuit_to_pauli: A CircuitToPauliStringsParameters object containing the original
        circuit and its associated Pauli strings.
    num_twirls: The number of twirled circuits to generate for each original circuit.
    num_readout_circuits: The number of readout calibration circuits to generate.
    rng: A NumPy random number generator for generating random Pauli twirls.

Returns:
    A tuple containing:
        - A combined list of the twirled Pauli circuits followed by the readout circuits.
        - A TRexMetadata object containing the random choices needed for post-processing.

## `measure_pauli_strings`

```python
def measure_pauli_strings(circuits_to_pauli: Mapping[circuits.FrozenCircuit, Sequence[ops.PauliString] | Sequence[Sequence[ops.PauliString]]] | list[CircuitToPauliStringsParameters], sampler: work.Sampler, pauli_repetitions: int, readout_repetitions: int, num_random_bitstrings: int, rng_or_seed: np.random.Generator | int, use_sweep: bool=False, insert_strategy: circuits.InsertStrategy=circuits.InsertStrategy.INLINE, measure_on_full_support: bool=False) -> list[CircuitToPauliStringsMeasurementResult]
```

Measures expectation values of Pauli strings on given circuits with/without
readout error mitigation.

Note: If `postselection_symmetries` are included in the `circuits_to_pauli` parameters,
the circuit will be measured using the post-selection symmetry method.
In this case, the `readout_repetitions` and `num_random_bitstrings` arguments are ignored.

Args:
    circuits_to_pauli: A list of CircuitToPauliStringsParameters objects, where each
    object contains:
        - The circuit to measure.
        - A list of QWC groups (list[list[ops.PauliString]]) or a list of PauliStrings
        (list[ops.PauliString]).
        - A dictionary mapping Pauli strings or Pauli sums to expected eigen value for
        postselection symmetries.
    sampler: The sampler to use.
    pauli_repetitions: The number of repetitions for each circuit when measuring
        Pauli strings.
    readout_repetitions: The number of repetitions for readout calibration
        in the shuffled benchmarking. (Ignored if `postselection_symmetries` are provided).
    num_random_bitstrings: The number of random bitstrings to use in readout
        benchmarking. (Ignored if `postselection_symmetries` are provided).
    rng_or_seed: A random number generator or seed for the readout benchmarking.
    use_sweep: If True, uses parameterized circuits and sweeps parameters
        for both Pauli measurements and readout benchmarking. Defaults to False.
    insert_strategy: The strategy for inserting measurement operations into the circuit.
        Defaults to circuits.InsertStrategy.INLINE.
    measure_on_full_support: If True, calculates the union of all qubits used in all
        Pauli strings (the full support). All circuits will then measure this full set
        of qubits, and readout benchmarking will be performed only once on this full set,
        rather than for every unique subset of Pauli qubits. This significantly reduces
        overhead when measuring many Pauli strings with varying support.

Returns:
    A list of CircuitToPauliStringsMeasurementResult objects, where each object contains:
        - The circuit that was measured.
        - A list of PauliStringMeasurementResult objects.
        - The calibration result for single-qubit readout errors.
