---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/diagonal_optimization_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/diagonal_optimization_test.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/diagonal_optimization_test.py`

Tests for diagonal_optimization transformer.

## `test_removes_z_before_measure`

```python
def test_removes_z_before_measure()
```

Tests that Z gates are removed before measurement.

## `test_removes_diagonal_chain`

```python
def test_removes_diagonal_chain()
```

Tests that a chain of diagonal gates is removed.

## `test_keeps_z_blocked_by_x`

```python
def test_keeps_z_blocked_by_x()
```

Tests that Z gates blocked by X gates are preserved.

## `test_keeps_cz_if_only_one_qubit_measured`

```python
def test_keeps_cz_if_only_one_qubit_measured()
```

Tests that CZ is kept if only one qubit is measured.

## `test_removes_cz_if_both_measured`

```python
def test_removes_cz_if_both_measured()
```

Tests that CZ is removed if both qubits are measured.

## `test_feature_request_z_cz_commutation`

```python
def test_feature_request_z_cz_commutation()
```

Test the original feature request #4935: Z-CZ commutation before measurement.

The circuit Z(q0) - CZ(q0, q1) - Z(q1) - M(q1) should keep the CZ gate.
This is because:
1. Z(q0) commutes through the CZ and Z(q1) is removed (via eject_z)
2. After commutation: CZ(q0, q1) - Z(q0) - M(q1)
3. CZ(q0, q1) and Z(q0) must be kept (q0 is not measured)

The optimized circuit is: CZ(q0, q1) - Z(q0) - M(q1)

## `test_feature_request_full_example`

```python
def test_feature_request_full_example()
```

Test the full feature request #4935 with measurements on both qubits.

## `test_preserves_non_diagonal_gates`

```python
def test_preserves_non_diagonal_gates()
```

Test that non-diagonal gates are preserved.

## `test_diagonal_gates_commute_before_measurement`

```python
def test_diagonal_gates_commute_before_measurement()
```

Test that multiple recognized diagonal gates are all removed when all qubits are measured.

This tests the property that recognized diagonal gates (Z, CZ) commute with each other,
so we don't remove qubits from measured_qubits when we encounter them. This allows
earlier diagonal gates in the circuit to also be removed.

## `test_unrecognized_diagonal_breaks_chain`

```python
def test_unrecognized_diagonal_breaks_chain()
```

Test that a CZ followed by an unrecognized diagonal 4x4 unitary is handled correctly.

Even if a gate is diagonal, if it's not a ZPowGate or CZPowGate, it won't be recognized
and will break the optimization chain. The earlier CZ gate cannot be removed because
the unrecognized diagonal gate blocks it.

## `test_is_z_or_cz_pow_gate_helper_edge_cases`

```python
def test_is_z_or_cz_pow_gate_helper_edge_cases()
```

Test edge cases in _is_z_or_cz_pow_gate helper function for full coverage.

## `test_tags_to_ignore_preserves_tagged_operations`

```python
def test_tags_to_ignore_preserves_tagged_operations()
```

Test that operations with tags_to_ignore are preserved and not optimized.

## `test_tags_to_ignore_does_not_break_optimization_chain`

```python
def test_tags_to_ignore_does_not_break_optimization_chain()
```

Test that tagged diagonal operations don't break the optimization chain.

For Z(q) -> Z[ignore](q) -> M(q), the first Z should still be removed because:
1. Diagonal gates commute with each other
2. The tagged Z is preserved but doesn't block earlier diagonal gates

## `test_tags_to_ignore_only_affects_tagged_operations`

```python
def test_tags_to_ignore_only_affects_tagged_operations()
```

Test that untagged operations are still optimized when tags_to_ignore is set.

## `test_deep_transforms_sub_circuits`

```python
def test_deep_transforms_sub_circuits()
```

Test that deep=True applies transformation to sub-circuits in CircuitOperation.

Uses CZ gate to truly test deep support - a Z gate alone would be removed by eject_z.

## `test_deep_false_preserves_sub_circuits`

```python
def test_deep_false_preserves_sub_circuits()
```

Test that deep=False (default) does not modify sub-circuits.

## `test_deep_with_tags_to_ignore_in_sub_circuit`

```python
def test_deep_with_tags_to_ignore_in_sub_circuit()
```

Test that tags_to_ignore is respected within sub-circuits when deep=True.
