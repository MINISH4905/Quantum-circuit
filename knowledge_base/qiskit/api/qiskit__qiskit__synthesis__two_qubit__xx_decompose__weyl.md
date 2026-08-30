---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/two_qubit/xx_decompose/weyl.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/two_qubit/xx_decompose/weyl.py
license: Apache-2.0
---

## Module `qiskit/synthesis/two_qubit/xx_decompose/weyl.py`

Simple circuit constructors for Weyl reflections.

## `apply_reflection`

```python
def apply_reflection(reflection_name, coordinate)
```

Given a reflection type and a canonical coordinate, applies the reflection
and describes a circuit which enacts the reflection + a global phase shift.

## `apply_shift`

```python
def apply_shift(shift_name, coordinate)
```

Given a shift type and a canonical coordinate, applies the shift and
describes a circuit which enacts the shift + a global phase shift.

## `canonical_rotation_circuit`

```python
def canonical_rotation_circuit(first_index, second_index)
```

Given a pair of distinct indices 0 ≤ (first_index, second_index) ≤ 2,
produces a two-qubit circuit which rotates a canonical gate

    a0 XX + a1 YY + a2 ZZ

into

    a[first] XX + a[second] YY + a[other] ZZ .
