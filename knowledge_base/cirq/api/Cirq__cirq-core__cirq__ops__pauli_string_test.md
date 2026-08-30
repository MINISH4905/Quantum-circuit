---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/pauli_string_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/pauli_string_test.py
license: Apache-2.0
---

## `assert_conjugation`

```python
def assert_conjugation(input_ps: cirq.PauliString, op: cirq.Operation, expected: cirq.PauliString | None=None, force_checking_unitary=True) -> None
```

Verifies that conjugating `input_ps` by `op` results in `expected`.

Also ensures that the unitary representation of the Pauli string is
preserved under the conjugation.

## `test_conjugated_by_global_phase`

```python
def test_conjugated_by_global_phase() -> None
```

Global phase gate preserves PauliString.

## `test_conjugated_by_ordering`

```python
def test_conjugated_by_ordering() -> None
```

Tests .conjugated_by([op1, op2]) == .conjugated_by(op2).conjugated_by(op1)
