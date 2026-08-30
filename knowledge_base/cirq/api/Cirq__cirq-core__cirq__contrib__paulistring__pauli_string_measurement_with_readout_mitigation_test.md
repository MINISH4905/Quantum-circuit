---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/paulistring/pauli_string_measurement_with_readout_mitigation_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/paulistring/pauli_string_measurement_with_readout_mitigation_test.py
license: Apache-2.0
---

## `test_pauli_string_measurement_errors_no_noise`

```python
def test_pauli_string_measurement_errors_no_noise(use_sweep: bool) -> None
```

Test that the mitigated expectation is close to the ideal expectation
based on the Pauli string

## `test_group_pauli_string_measurement_errors_no_noise_with_coefficient`

```python
def test_group_pauli_string_measurement_errors_no_noise_with_coefficient(use_sweep: bool) -> None
```

Test that the mitigated expectation is close to the ideal expectation
based on the group of Pauli strings

## `test_pauli_string_measurement_errors_with_noise`

```python
def test_pauli_string_measurement_errors_with_noise(use_sweep: bool) -> None
```

Test that the mitigated expectation is close to the ideal expectation
based on the Pauli string

## `test_group_pauli_string_measurement_errors_with_noise`

```python
def test_group_pauli_string_measurement_errors_with_noise(use_sweep: bool) -> None
```

Test that the mitigated expectation is close to the ideal expectation
based on the group Pauli strings

## `test_many_circuits_mixed_mitigation_types`

```python
def test_many_circuits_mixed_mitigation_types(use_sweep: bool) -> None
```

Test mixed input: some circuits using confusion matrices, some using symmetries.

This test specifically includes a QWC group with multiple Pauli strings to
ensure the processing logic handles nested groups correctly.

## `test_allow_group_pauli_measurement_without_readout_mitigation`

```python
def test_allow_group_pauli_measurement_without_readout_mitigation(use_sweep: bool) -> None
```

Test that the function allows to measure without error mitigation

## `test_many_circuits_with_coefficient`

```python
def test_many_circuits_with_coefficient(use_sweep: bool, insert_strategy: cirq.InsertStrategy) -> None
```

Test that the mitigated expectation is close to the ideal expectation
based on the Pauli string for multiple circuits

## `test_many_group_pauli_in_circuits_with_coefficient`

```python
def test_many_group_pauli_in_circuits_with_coefficient(use_sweep: bool) -> None
```

Test that the mitigated expectation is close to the ideal expectation
based on the Pauli string for multiple circuits

## `test_coefficient_not_real_number`

```python
def test_coefficient_not_real_number() -> None
```

Test that the coefficient of input pauli string is not real.
Should return error in this case

## `test_empty_input_circuits_to_pauli_mapping`

```python
def test_empty_input_circuits_to_pauli_mapping() -> None
```

Test that the input circuits are empty.

## `test_invalid_input_container_type`

```python
def test_invalid_input_container_type() -> None
```

Test that passing an invalid container type raises TypeError.

## `test_circuit_parameters_validation_errors`

```python
def test_circuit_parameters_validation_errors() -> None
```

Test validation errors specific to CircuitToPauliStringsParameters attributes.

## `test_all_pauli_strings_are_pauli_i`

```python
def test_all_pauli_strings_are_pauli_i() -> None
```

Test that all input pauli are pauli I

## `test_zero_pauli_repetitions`

```python
def test_zero_pauli_repetitions() -> None
```

Test that the pauli repetitions are zero.

## `test_negative_num_random_bitstrings`

```python
def test_negative_num_random_bitstrings() -> None
```

Test that the number of random bitstrings is smaller than zero.

## `test_zero_readout_repetitions`

```python
def test_zero_readout_repetitions() -> None
```

Test that the readout repetitions is zero.

## `test_rng_type_mismatch`

```python
def test_rng_type_mismatch() -> None
```

Test that the rng is not a numpy random generator or a seed.

## `test_group_paulis_are_not_qwc`

```python
def test_group_paulis_are_not_qwc() -> None
```

Test that the group paulis are not qwc.

## `test_empty_group_paulis_not_allowed`

```python
def test_empty_group_paulis_not_allowed() -> None
```

Test that the group paulis are empty

## `test_postselection_symmetry_validation_and_logic`

```python
def test_postselection_symmetry_validation_and_logic() -> None
```

Test validation and QWC logic for post-selection symmetries.

## `test_sampler_receives_correct_circuits`

```python
def test_sampler_receives_correct_circuits(use_sweep: bool) -> None
```

Test that the sampler receives circuits with correct measurement qubits.

## `test_build_trex_twirled_pauli_circuits_multiple_twirls`

```python
def test_build_trex_twirled_pauli_circuits_multiple_twirls()
```

Test generating multiple circuits from a multi-row twirl_choices array.

## `test_trex_metadata_instantiation`

```python
def test_trex_metadata_instantiation() -> None
```

Test the instantiation and attributes of TRexMetadata.
