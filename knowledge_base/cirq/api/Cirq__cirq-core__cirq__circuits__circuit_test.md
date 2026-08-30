---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/circuits/circuit_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/circuits/circuit_test.py
license: Apache-2.0
---

## `test_circuit_superoperator_fixed_values`

```python
def test_circuit_superoperator_fixed_values(circuit, expected_superoperator) -> None
```

Tests Circuit._superoperator_() on a few simple circuits.

## `test_circuit_superoperator_depolarizing_channel_compositions`

```python
def test_circuit_superoperator_depolarizing_channel_compositions(rs, n_qubits) -> None
```

Tests Circuit._superoperator_() on compositions of depolarizing channels.

## `density_operator_basis`

```python
def density_operator_basis(n_qubits: int) -> Iterator[np.ndarray]
```

Yields operator basis consisting of density operators.

## `test_compare_circuits_superoperator_to_simulation`

```python
def test_compare_circuits_superoperator_to_simulation(circuit, initial_state) -> None
```

Compares action of circuit superoperator and circuit simulation.
