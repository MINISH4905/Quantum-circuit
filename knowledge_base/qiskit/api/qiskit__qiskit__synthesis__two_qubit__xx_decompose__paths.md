---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/two_qubit/xx_decompose/paths.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/two_qubit/xx_decompose/paths.py
license: Apache-2.0
---

## Module `qiskit/synthesis/two_qubit/xx_decompose/paths.py`

Routines for producing right-angled paths through the Weyl alcove.  Consider a set of native
interactions with an associated minimal covering set of minimum-cost circuit polytopes, as well as a
target coordinate.  The coverage set associates to the target coordinate a circuit type
C = (O1 ... On) consisting of a sequence of native interactions Oj.  A _path_ is a sequence
(I P1 ... Pn) of intermediate Weyl points, where Pj is accessible from P(j-1) by Oj.  A path is said
to be _right-angled_ when at each step one coordinate is fixed (up to possible Weyl reflection) when
expressed in canonical coordinates.

The key inputs to our method are:

+ A family of "b coordinates" which describe the target canonical coordinate.
+ A family of "a coordinates" which describe the source canonical coordinate.
+ A sequence of interaction strengths for which the b-coordinate can be modeled, with one selected
  to be stripped from the sequence ("beta").  The others are bundled as the sum of the
  sequence (s+), its maximum value (s1), and its second maximum value (s2).

Given the b-coordinate and a set of intersection strengths, the procedure for backsolving for the
a-coordinates is then extracted from the monodromy polytope.

NOTE: The constants in this file are auto-generated and are not meant to be edited by hand / read.

## `get_augmented_coordinate`

```python
def get_augmented_coordinate(target_coordinate, strengths)
```

Assembles a coordinate in the system used by `xx_region_polytope`.

## `decomposition_hop`

```python
def decomposition_hop(target_coordinate, strengths)
```

Given a `target_coordinate` and a list of interaction `strengths`, produces a new canonical
coordinate which is one step back along `strengths`.

`target_coordinate` is taken to be in positive canonical coordinates, and the entries of
strengths are taken to be [0, pi], so that (sj / 2, 0, 0) is a positive canonical coordinate.
