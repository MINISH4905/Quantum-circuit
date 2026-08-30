---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/quantum_volume/quantum_volume_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/quantum_volume/quantum_volume_test.py
license: Apache-2.0
---

## Module `cirq-core/cirq/contrib/quantum_volume/quantum_volume_test.py`

Tests for the Quantum Volume utilities.

## `test_generate_model_circuit`

```python
def test_generate_model_circuit() -> None
```

Test that a model circuit is randomly generated.

## `test_generate_model_circuit_without_seed`

```python
def test_generate_model_circuit_without_seed() -> None
```

Test that a model circuit is randomly generated without a seed.

## `test_generate_model_circuit_seed`

```python
def test_generate_model_circuit_seed() -> None
```

Test that a model circuit is determined by its seed .

## `test_compute_heavy_set`

```python
def test_compute_heavy_set() -> None
```

Test that the heavy set can be computed from a given circuit.

## `test_sample_heavy_set`

```python
def test_sample_heavy_set() -> None
```

Test that we correctly sample a circuit's heavy set

## `test_sample_heavy_set_with_parity`

```python
def test_sample_heavy_set_with_parity() -> None
```

Test that we correctly sample a circuit's heavy set with a parity map

## `test_compile_circuit_router`

```python
def test_compile_circuit_router() -> None
```

Tests that the given router is used.

## `test_compile_circuit`

```python
def test_compile_circuit() -> None
```

Tests that we are able to compile a model circuit.

## `test_compile_circuit_replaces_swaps`

```python
def test_compile_circuit_replaces_swaps() -> None
```

Tests that the compiler never sees the SwapPermutationGates from the
router.

## `test_compile_circuit_with_readout_correction`

```python
def test_compile_circuit_with_readout_correction() -> None
```

Tests that we are able to compile a model circuit with readout error
correction.

## `test_compile_circuit_multiple_routing_attempts`

```python
def test_compile_circuit_multiple_routing_attempts() -> None
```

Tests that we make multiple attempts at routing and keep the best one.

## `test_compile_circuit_no_routing_attempts`

```python
def test_compile_circuit_no_routing_attempts() -> None
```

Tests that setting no routing attempts throws an error.

## `test_calculate_quantum_volume_result`

```python
def test_calculate_quantum_volume_result() -> None
```

Test that running the main loop returns the desired result

## `test_calculate_quantum_volume_result_with_device_graph`

```python
def test_calculate_quantum_volume_result_with_device_graph() -> None
```

Test that running the main loop routes the circuit onto the given device
graph

## `test_calculate_quantum_volume_loop`

```python
def test_calculate_quantum_volume_loop() -> None
```

Test that calculate_quantum_volume is able to run without erring.

## `test_calculate_quantum_volume_loop_with_readout_correction`

```python
def test_calculate_quantum_volume_loop_with_readout_correction() -> None
```

Test that calculate_quantum_volume is able to run without erring with
readout error correction.
