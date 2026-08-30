---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/dynamical_decoupling_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/dynamical_decoupling_test.py
license: Apache-2.0
---

## `test_classically_controlled_no_update_succeeds`

```python
def test_classically_controlled_no_update_succeeds()
```

Test case diagrams.
Input:
a: ───M───I───
      ║   ║
a: ═══@═══^═══

## `test_no_insertion`

```python
def test_no_insertion() -> None
```

Test case diagrams.
Input:
a: ───H───@───────
          │
b: ───────X───H───
Output:
a: ───H───@───────
          │
b: ───────X───H───

## `test_insert_provided_schema`

```python
def test_insert_provided_schema(schema: str, inserted_gates: Sequence[cirq.Gate]) -> None
```

Test case diagrams.
Input:
a: ───H───@───────────M───
          │
b: ───────X───@───@───M───
              │   │
c: ───────────X───X───M───

## `test_insert_by_customized_dd_sequence`

```python
def test_insert_by_customized_dd_sequence() -> None
```

Test case diagrams.
    Input:
a: ───H───@───────────────────H───
          │
b: ───────X───@───@───@───@───H───
              │   │   │   │
c: ───────────X───X───X───X───H───
Output:
a: ───H───@───X───X───Y───Y───H───
          │
b: ───────X───@───@───@───@───H───
              │   │   │   │
c: ───────────X───X───X───X───H───

## `test_pull_through_h_gate_case1`

```python
def test_pull_through_h_gate_case1(single_qubit_gate_moments_only: bool) -> None
```

Test case diagrams.
Input:
a: ───H───────H───────@───
                      │
b: ───H───H───H───H───X───

## `test_pull_through_h_gate_case2`

```python
def test_pull_through_h_gate_case2(single_qubit_gate_moments_only: bool) -> None
```

Test case diagrams.
Input:
a: ───H───────H───────H───

b: ───H───H───H───H───H───

## `test_scattered_circuit`

```python
def test_scattered_circuit() -> None
```

Test case diagrams.
Input:
0: ───────────────────────────────H───@───H───
                                      │
1: ───────────────────────H───@───H───@───H───
                              │
2: ───────────────H───@───H───@───────────H───
                      │
3: ───H───────@───H───@───────────────────H───
              │
4: ───H───@───@───────────────────────────H───
          │
5: ───H───@───────H───@───────────────────H───
                      │
6: ───────────────H───@───H───@───────────H───
                              │
7: ───────────────────────H───@───H───@───H───
                                      │
8: ───────────────────────────────H───@───H───

Output (single_qubit_gate_moment_only_on):
0: ───────────────────────────────H───@───H────────────────────────
                                      │
1: ───────────────────────H───@───H───@───H────────────────────────
                              │
2: ───────────────H───@───H───@───X───────PhXZ(a=-0.5,x=0.5,z=0)───
                      │
3: ───H───────@───H───@───X───────Y───────PhXZ(a=0.5,x=0.5,z=0)────
              │
4: ───H───@───@───X───────Y───────X───────PhXZ(a=0.5,x=0.5,z=-1)───
          │
5: ───H───@───────H───@───X───────Y───────PhXZ(a=0.5,x=0.5,z=0)────
                      │
6: ───────────────H───@───H───@───X───────PhXZ(a=-0.5,x=0.5,z=0)───
                              │
7: ───────────────────────H───@───H───@───H────────────────────────
                                      │
8: ───────────────────────────────H───@───H────────────────────────

Output (single_qubit_gate_moment_only_off):
0: ───────────────────────────────H───@───H───────────────────────
                                      │
1: ───────────────────────H───@───H───@───H───────────────────────
                              │
2: ───────────────H───@───H───@───X───Y───PhXZ(a=0.5,x=0.5,z=0)───
                      │
3: ───H───X───@───H───@───Y───X───Y───X───PhXZ(a=0.5,x=0.5,z=0)───
              │
4: ───H───@───@───X───Y───X───Y───X───Y───H───────────────────────
          │
5: ───H───@───X───H───@───Y───X───Y───X───PhXZ(a=0.5,x=0.5,z=0)───
                      │
6: ───────────────H───@───H───@───X───Y───PhXZ(a=0.5,x=0.5,z=0)───
                              │
7: ───────────────────────H───@───H───@───H───────────────────────
                                      │
8: ───────────────────────────────H───@───H───────────────────────

## `test_scattered_circuit2`

```python
def test_scattered_circuit2() -> None
```

Test case diagrams.
Input:
0: ───────────────────@───
                      │
1: ───────────────@───@───
                  │
2: ───────────@───@───────
              │
3: ───────@───@───────────
          │
4: ───@───@───────────────
      │
5: ───@───────@───────────
              │
6: ───────────@───@───────
                  │
7: ───────────────@───@───
                      │
8: ───────────────────@───

## `test_pull_through_chain`

```python
def test_pull_through_chain() -> None
```

Test case diagrams.
Input:
0: ───X───────×───────────X───
              │
1: ───────Y───×───×───────X───
                  │
2: ───────────────×───×───X───
                      │
3: ───────────────────×───X───

## `test_multiple_clifford_pieces_case1`

```python
def test_multiple_clifford_pieces_case1() -> None
```

Test case diagrams.
Input:
a: ───H───────H───────@───────────H───────H───
                      │
b: ───H───H───H───H───@^0.5───H───H───H───H───

## `test_multiple_clifford_pieces_case2`

```python
def test_multiple_clifford_pieces_case2() -> None
```

Test case diagrams.
Input:
a: ───@───PhXZ(a=0.3,x=0.2,z=0)───PhXZ(a=0.3,x=0.2,z=0)───PhXZ(a=0.3,x=0.2,z=0)───@───
      │                                                                           │
b: ───@───────────────────────────────────────────────────────────────────────────@───

## `test_absorb_remaining_dd_sequence`

```python
def test_absorb_remaining_dd_sequence() -> None
```

Test case diagrams.
Input:
a: ───H───────H───@───@───────
                  │   │
b: ───H───H───H───X───@^0.5───

c: ───H───────────────H───────

## `test_with_non_clifford_measurements`

```python
def test_with_non_clifford_measurements() -> None
```

Test case diagrams.
Input:
0: ───────────H───@───H───M───
                  │
1: ───H───@───────@───────M───
          │
2: ───H───@───H───@───────M───
                  │
3: ───────────H───@───H───M───

## `test_cross_clifford_pieces_filling_merge`

```python
def test_cross_clifford_pieces_filling_merge() -> None
```

Test case diagrams.
Input:
0: ─────────────────────────────────PhXZ(a=0.2,x=0.2,z=0.1)───@─────────────────────────PhXZ(a=0.2,x=0.2,z=0.1)───@───PhXZ(a=0.2,x=0.2,z=0.1)───H───
                                                              │                                                   │
1: ─────────────────────────────────PhXZ(a=0.2,x=0.2,z=0.1)───@─────────────────────────PhXZ(a=0.2,x=0.2,z=0.1)───@───PhXZ(a=0.2,x=0.2,z=0.1)───H───

2: ───PhXZ(a=0.2,x=0.2,z=0.1)───@───PhXZ(a=0.2,x=0.2,z=0.1)───@─────────────────────────PhXZ(a=0.2,x=0.2,z=0.1)───@─────────────────────────────H───
                                │                             │                                                   │
3: ─────────────────────────────┼───PhXZ(a=0.2,x=0.2,z=0.1)───@───────────────────────────────────────────────────@─────────────────────────────H───
                                │
4: ─────────────────────────────┼─────────────────────────────@─────────────────────────────────────────────────────────────────────────────────H───
                                │                             │
5: ───PhXZ(a=0.2,x=0.2,z=0.1)───@───PhXZ(a=0.2,x=0.2,z=0.1)───@─────────────────────────PhXZ(a=0.2,x=0.2,z=0.1)───@───PhXZ(a=0.2,x=0.2,z=0.1)───H───
                                                                                                                  │
6: ───────────────────────────────────────────────────────────PhXZ(a=0.2,x=0.2,z=0.1)─────────────────────────────@───PhXZ(a=0.2,x=0.2,z=0.1)───H───

## `test_pull_through_phxz_gate_case1`

```python
def test_pull_through_phxz_gate_case1() -> None
```

Test case diagrams.

Input:
a: ───H───────PhXZ(a=0.25,x=-1,z=0)───────@───
                                          │
b: ───H───H───H───────────────────────H───X───
Output: expected circuit diagram below.

## `test_pull_through_phxz_gate_case2`

```python
def test_pull_through_phxz_gate_case2() -> None
```

Test case diagrams.

Input:
a: ───H───────PhXZ(a=0.2,x=-1,z=0)───────@───
                                          │
b: ───H───H───H───────────────────────H───X───
Output: expected circuit diagram below.

## `test_merge_before_non_cliffords`

```python
def test_merge_before_non_cliffords() -> None
```

Test case diagrams.
Input circuit:
0: ───X──────────────────────────────────────────────────M───

1: ───X───────PhXZ(a=-1,x=0,z=-0.5)───FSim(0, 0.0637π)───M───
                                      │
2: ───X───X───S───────────────────────FSim(0, 0.0637π)───M───

## `test_runtime_error_if_pulled_through_not_empty_mocked`

```python
def test_runtime_error_if_pulled_through_not_empty_mocked() -> None
```

Tests that a RuntimeError is raised if pulled_through is not empty at the end.

This test explicitly mocks the internal state to simulate a scenario where
the `pulled_through` PauliString is not empty after processing all moments.
Under normal operation, the `_Grid` and `add_dynamical_decoupling`
logic should ensure `pulled_through` is always empty at the end, making
this RuntimeError theoretically unreachable. This test verifies the
defensive check itself.

## `test_labeled_circuit_str`

```python
def test_labeled_circuit_str()
```

Input circuit:
0: ───X──────────────────────────────────────────────────M───

1: ───X───────PhXZ(a=-1,x=0,z=-0.5)───FSim(0, 0.0637π)───M───
                                      │
2: ───X───X───S───────────────────────FSim(0, 0.0637π)───M───

## `test_labeled_circuit_str_empty`

```python
def test_labeled_circuit_str_empty()
```

Tests the __str__ method of _Grid for empty and no-qubit circuits.

## `test_add_dynamical_decoupling_with_deep_context_raises_error`

```python
def test_add_dynamical_decoupling_with_deep_context_raises_error()
```

Tests that add_dynamical_decoupling raises an error with deep context.
