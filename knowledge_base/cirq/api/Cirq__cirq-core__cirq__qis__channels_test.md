---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/qis/channels_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/qis/channels_test.py
license: Apache-2.0
---

## Module `cirq-core/cirq/qis/channels_test.py`

Tests for channels.

## `test_kraus_to_choi`

```python
def test_kraus_to_choi(kraus_operators, expected_choi) -> None
```

Verifies that cirq.kraus_to_choi computes the correct Choi matrix.

## `test_choi_to_kraus_fixed_values`

```python
def test_choi_to_kraus_fixed_values(choi, expected_kraus) -> None
```

Verifies that cirq.choi_to_kraus gives correct results on a few fixed inputs.

## `test_choi_to_kraus_action_on_operatorial_basis`

```python
def test_choi_to_kraus_action_on_operatorial_basis(choi) -> None
```

Verifies that cirq.choi_to_kraus computes a valid Kraus representation.

## `test_choi_to_kraus_inverse_of_kraus_to_choi`

```python
def test_choi_to_kraus_inverse_of_kraus_to_choi(choi) -> None
```

Verifies that cirq.kraus_to_choi(cirq.choi_to_kraus(.)) is identity on Choi matrices.

## `test_choi_to_kraus_atol`

```python
def test_choi_to_kraus_atol() -> None
```

Verifies that insignificant Kraus operators are omitted.

## `test_operation_to_choi`

```python
def test_operation_to_choi(channel) -> None
```

Verifies that cirq.operation_to_choi correctly computes the Choi matrix.

## `test_choi_for_completely_dephasing_channel`

```python
def test_choi_for_completely_dephasing_channel() -> None
```

Checks cirq.operation_to_choi on the completely dephasing channel.

## `test_superoperator_to_kraus_fixed_values`

```python
def test_superoperator_to_kraus_fixed_values(superoperator, expected_kraus_operators) -> None
```

Verifies that cirq.kraus_to_superoperator computes the correct channel matrix.

## `test_superoperator_to_kraus_inverse_of_kraus_to_superoperator`

```python
def test_superoperator_to_kraus_inverse_of_kraus_to_superoperator(superoperator) -> None
```

Verifies that cirq.kraus_to_superoperator(cirq.superoperator_to_kraus(.)) is identity.

## `test_superoperator_to_kraus_atol`

```python
def test_superoperator_to_kraus_atol() -> None
```

Verifies that insignificant Kraus operators are omitted.

## `test_superoperator_for_completely_dephasing_channel`

```python
def test_superoperator_for_completely_dephasing_channel() -> None
```

Checks cirq.operation_to_superoperator on the completely dephasing channel.
