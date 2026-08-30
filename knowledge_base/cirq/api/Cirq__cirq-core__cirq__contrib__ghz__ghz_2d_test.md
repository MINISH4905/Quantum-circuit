---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/ghz/ghz_2d_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/ghz/ghz_2d_test.py
license: Apache-2.0
---

## Module `cirq-core/cirq/contrib/ghz/ghz_2d_test.py`

Tests for generating and validating 2D GHZ state circuits.

## `test_ghz_circuits_size`

```python
def test_ghz_circuits_size(num_qubits: int, randomized: bool, add_dd_and_align_right: bool) -> None
```

Tests the size of the GHZ circuits.

## `test_ghz_circuits_state`

```python
def test_ghz_circuits_state(num_qubits: int, randomized: bool, add_dd_and_align_right: bool) -> None
```

Tests the state vector form of the GHZ circuits.

## `test_transform_circuit_properties`

```python
def test_transform_circuit_properties() -> None
```

Tests that _transform_circuit preserves circuit properties.

## `manhattan_distance`

```python
def manhattan_distance(q1: cirq.GridQubit, q2: cirq.GridQubit) -> int
```

Calculates the Manhattan distance between two GridQubits.

## `test_ghz_circuits_bfs_order`

```python
def test_ghz_circuits_bfs_order(num_qubits: int) -> None
```

Verifies that the circuit construction maintains BFS order

## `test_ghz_invalid_inputs`

```python
def test_ghz_invalid_inputs() -> None
```

Tests that the function raises errors for invalid inputs.

## `test_dynamical_decoupling_is_applied`

```python
def test_dynamical_decoupling_is_applied() -> None
```

Verifies that DD is applied for the add_dd_and_align_right flag.
