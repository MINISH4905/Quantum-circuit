---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/merge_single_qubit_gates_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/merge_single_qubit_gates_test.py
license: Apache-2.0
---

## `TestMergeSingleQubitGatesSymbolized`

```python
class TestMergeSingleQubitGatesSymbolized(TestCase)
```

Test suite for merge_single_qubit_gates_to_phxz_symbolized.

### `test_case1`

```python
def test_case1(self) -> None
```

Test case diagram.
Input circuit:
0: ───X─────────@────────H[ignore]─H──X──PhXZ(a=a0,x=x0,z=z0)──X──PhXZ(a=a1,x=x1,z=z1)───
                │
1: ───H^h_exp───@^cz_exp─────────────────────────────────────────────────────────────────
Expected output:
0: ───PhXZ(a=-1,x=1,z=0)─────@──────────H[ignore]───PhXZ(a=a1,x=x1,z=z1)───
                             │
1: ───PhXZ(a=a0,x=x0,z=z0)───@^cz_exp──────────────────────────────────────

### `test_case_non_parameterized_singles`

```python
def test_case_non_parameterized_singles(self) -> None
```

Test merge_single_qubit_gates_to_phxz_symbolized when all single qubit gates are not
parameterized.

### `test_fail_different_structures_error`

```python
def test_fail_different_structures_error(self) -> None
```

Tests that the function raises a ValueError if merged structures of the circuit differ
for different parameterizations.

### `test_fail_unexpected_gate_error`

```python
def test_fail_unexpected_gate_error(self) -> None
```

Tests that the function raises a RuntimeError of unexpected gate.
