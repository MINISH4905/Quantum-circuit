---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/two_qubit/xx_decompose/polytopes.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/two_qubit/xx_decompose/polytopes.py
license: Apache-2.0
---

## Module `qiskit/synthesis/two_qubit/xx_decompose/polytopes.py`

Defines bare dataclasses which house polytope information, as well as a specialized data structure
which describes those two-qubit programs accessible to a given sequence of XX-type interactions.

## `ConvexPolytopeData`

```python
class ConvexPolytopeData
```

The raw data underlying a ConvexPolytope.  Describes a single convex
polytope, specified by families of `inequalities` and `equalities`, each
entry of which respectively corresponds to

    inequalities[j][0] + sum_i inequalities[j][i] * xi >= 0

and

    equalities[j][0] + sum_i equalities[j][i] * xi == 0.

## `PolytopeData`

```python
class PolytopeData
```

The raw data of a union of convex polytopes.

## `polytope_has_element`

```python
def polytope_has_element(polytope, point)
```

Tests whether `polytope` contains `point`.

## `manual_get_vertex`

```python
def manual_get_vertex(polytope, seed=42)
```

Returns a single random vertex from `polytope`.

## `XXPolytope`

```python
class XXPolytope
```

Describes those two-qubit programs accessible to a given sequence of XX-type interactions.

NOTE: Strengths are normalized so that CX corresponds to pi / 4, which differs from Qiskit's
      conventions around RZX elsewhere.

### `from_strengths`

```python
def from_strengths(cls, *strengths)
```

Constructs an XXPolytope from a sequence of strengths.

### `add_strength`

```python
def add_strength(self, new_strength: float=0.0)
```

Returns a new XXPolytope with one new XX interaction appended.

### `member`

```python
def member(self, point)
```

Returns True when `point` is a member of `self`.

### `nearest`

```python
def nearest(self, point)
```

Finds the nearest point (in Euclidean or infidelity distance) to `self`.
