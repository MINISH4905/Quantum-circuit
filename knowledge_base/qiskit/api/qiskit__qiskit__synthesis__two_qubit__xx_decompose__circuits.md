---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/two_qubit/xx_decompose/circuits.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/two_qubit/xx_decompose/circuits.py
license: Apache-2.0
---

## Module `qiskit/synthesis/two_qubit/xx_decompose/circuits.py`

Tools for building optimal circuits out of XX interactions.

Inputs:
 + A set of native XX operations, described as strengths.
 + A right-angled path, computed using the methods in `paths.py`.

Output:
 + A circuit which implements the target operation (expressed exactly as the exponential of
 `a XX + b YY + c ZZ`) using the native operations and local gates.

## `decompose_xxyy_into_xxyy_xx`

```python
def decompose_xxyy_into_xxyy_xx(a_target, b_target, a_source, b_source, interaction)
```

Consumes a target canonical interaction CAN(a_target, b_target) and source interactions
CAN(a1, b1), CAN(a2), then manufactures a circuit identity of the form

CAN(a_target, b_target) = (Zr, Zs) CAN(a_source, b_source) (Zu, Zv) CAN(interaction) (Zx, Zy).

Returns the 6-tuple (r, s, u, v, x, y).

## `xx_circuit_step`

```python
def xx_circuit_step(source, strength, target, embodiment)
```

Builds a single step in an XX-based circuit.

`source` and `target` are positive canonical coordinates; `strength` is the interaction strength
at this step in the circuit as a canonical coordinate (so that CX = RZX(pi/2) corresponds to
pi/4); and `embodiment` is a Qiskit circuit which enacts the canonical gate of the prescribed
interaction `strength`.

## `canonical_xx_circuit`

```python
def canonical_xx_circuit(target, strength_sequence, basis_embodiments)
```

Assembles a Qiskit circuit from a specified `strength_sequence` of XX-type interactions which
emulates the canonical gate at canonical coordinate `target`.  The circuits supplied by
`basis_embodiments` are used to instantiate the individual XX actions.

NOTE: The elements of `strength_sequence` are expected to be normalized so that np.pi/2
    corresponds to RZX(np.pi/2) = CX; `target` is taken to be a positive canonical coordinate;
    and `basis_embodiments` maps `strength_sequence` elements to circuits which instantiate
    these gates.
