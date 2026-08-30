---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/gauge_compiling/multi_moment_cphase_gauge_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/gauge_compiling/multi_moment_cphase_gauge_test.py
license: Apache-2.0
---

## `test_gauge_on_single_cphase`

```python
def test_gauge_on_single_cphase()
```

Test case.
Input:
0: ───@───────
      │
1: ───@^0.2───
Example output:
0: ───X───@────────PhXZ(a=0,x=1,z=0)───
          │
1: ───I───@^-0.2───Z^0.2───────────────

## `test_gauge_on_cz_moments`

```python
def test_gauge_on_cz_moments()
```

Test case.
Input:
          ┌──┐
0: ───@────@─────H───────@───@───
      │    │             │   │
1: ───@────┼@────────────@───@───
           ││
2: ───@────@┼────────@───@───@───
      │     │        │   │   │
3: ───@─────@────────@───@───@───
          └──┘
Example output:
              ┌──┐
0: ───X───@────@─────PhXZ(a=0,x=1,z=1)──────H───X───────@───@───PhXZ(a=0,x=1,z=2)────
          │    │                                        │   │
1: ───I───@────┼@────Z──────────────────────────X───────@───@───PhXZ(a=2,x=1,z=-2)───
               ││
2: ───Y───@────@┼────PhXZ(a=1.5,x=1,z=-1)───────Z───@───@───@───Z────────────────────
          │     │                                   │   │   │
3: ───Z───@─────@────Z^0────────────────────────I───@───@───@───Z^0──────────────────
              └──┘

## `test_gauge_on_cphase_moments`

```python
def test_gauge_on_cphase_moments()
```

Test case.
Input:
              ┌──┐
0: ───@────────@─────H───Rz(-0.255π)───────────@───────@───────
      │        │                               │       │
1: ───@^0.2────┼@──────────────────────────────@^0.1───@───────
               ││
2: ───@────────@┼────────@─────────────@───────@───────@───────
      │         │        │             │       │       │
3: ───@─────────@────────@^0.2─────────@^0.2───@───────@^0.2───
              └──┘
Example output:
                   ┌──┐
0: ───Y───@─────────@─────PhXZ(a=0,x=1,z=0)───H───X───Rz(0.255π)────────────@───────@────────PhXZ(a=0,x=1,z=1.1)───
          │         │                                                       │       │
1: ───I───@^-0.2────┼@────Z^0.2───────────────────Y─────────────────────────@^0.1───@────────PhXZ(a=0,x=1,z=0.1)───
                    ││
2: ───X───@─────────@┼────PhXZ(a=0,x=1,z=1)───────X───@────────────@────────@───────@────────PhXZ(a=0,x=1,z=0)─────
          │          │                                │            │        │       │
3: ───Z───@──────────@────I───────────────────────I───@^-0.2───────@^-0.2───@───────@^-0.2───Z^-0.4────────────────
                   └──┘

## `test_pauli_and_phxz_util_gate_merges`

```python
def test_pauli_and_phxz_util_gate_merges()
```

Tests _PauliAndZPow's merge_left() and merge_right().

## `test_pauli_and_phxz_util_to_1q_gate`

```python
def test_pauli_and_phxz_util_to_1q_gate()
```

Tests _PauliAndZPow.to_single_qubit_gate().
