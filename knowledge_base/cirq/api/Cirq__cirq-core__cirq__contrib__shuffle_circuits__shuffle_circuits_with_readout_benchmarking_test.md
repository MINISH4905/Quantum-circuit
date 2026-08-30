---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/shuffle_circuits/shuffle_circuits_with_readout_benchmarking_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/shuffle_circuits/shuffle_circuits_with_readout_benchmarking_test.py
license: Apache-2.0
---

## `test_circuits_with_readout_benchmarking_errors_no_noise`

```python
def test_circuits_with_readout_benchmarking_errors_no_noise(mode: str) -> None
```

Test shuffled/sweep circuits with readout benchmarking with no noise from sampler.

## `test_circuits_with_readout_benchmarking_errors_with_noise`

```python
def test_circuits_with_readout_benchmarking_errors_with_noise(mode: str) -> None
```

Test shuffled/sweep circuits with readout benchmarking with noise from sampler.

## `test_circuits_with_readout_benchmarking_errors_with_noise_and_input_qubits`

```python
def test_circuits_with_readout_benchmarking_errors_with_noise_and_input_qubits(mode: str) -> None
```

Test shuffled/sweep circuits with readout benchmarking with
noise from sampler and input qubits.

## `test_circuits_with_readout_benchmarking_errors_with_noise_and_lists_input_qubits`

```python
def test_circuits_with_readout_benchmarking_errors_with_noise_and_lists_input_qubits(mode: str) -> None
```

Test shuffled/sweep circuits with readout benchmarking with noise
from sampler and input qubits.

## `test_can_handle_zero_random_bitstring`

```python
def test_can_handle_zero_random_bitstring(mode: str) -> None
```

Test shuffled/sweep circuits without readout benchmarking.

## `test_circuits_with_readout_benchmarking_no_qubits_arg_empty_rng`

```python
def test_circuits_with_readout_benchmarking_no_qubits_arg_empty_rng(mode: str) -> None
```

Test benchmarking when the `qubits` argument is not provided.

## `test_deprecated_run_shuffled_with_readout_benchmarking`

```python
def test_deprecated_run_shuffled_with_readout_benchmarking() -> None
```

Test that the deprecated function works correctly and is covered.

## `test_empty_input_circuits`

```python
def test_empty_input_circuits() -> None
```

Test that the input circuits are empty.

## `test_non_circuit_input`

```python
def test_non_circuit_input() -> None
```

Test that the input circuits are not of type cirq.Circuit.

## `test_no_measurements`

```python
def test_no_measurements() -> None
```

Test that the input circuits don't have measurements.

## `test_zero_circuit_repetitions`

```python
def test_zero_circuit_repetitions() -> None
```

Test that the circuit repetitions are zero.

## `test_mismatch_circuit_repetitions`

```python
def test_mismatch_circuit_repetitions() -> None
```

Test that the number of circuit repetitions don't match the number of input circuits.

## `test_zero_num_random_bitstrings`

```python
def test_zero_num_random_bitstrings() -> None
```

Test that the number of random bitstrings is smaller than zero.

## `test_zero_readout_repetitions`

```python
def test_zero_readout_repetitions() -> None
```

Test that the readout repetitions is zero.

## `test_empty_sweep_params`

```python
def test_empty_sweep_params() -> None
```

Test that the sweep params are empty.
