---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/phased_x_z_gate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/phased_x_z_gate.py
license: Apache-2.0
---

## `PhasedXZGate`

```python
class PhasedXZGate(raw_types.Gate)
```

A single qubit gate equivalent to the circuit $Z^{-a} X^x Z^{a} Z^z$ (in time order).

The unitary matrix of `cirq.PhasedXZGate(x_exponent=x, z_exponent=z, axis_phase_exponent=a)` is:
$$
    \begin{bmatrix}
        e^{i \pi x / 2} \cos(\pi x /2) & -i e^{i \pi (x/2 - a)} \sin(\pi x / 2) \\
         -i e^{i \pi (x/2 + z + a)} \sin(\pi x / 2) &  e^{i \pi (x / 2 + z)} \cos(\pi x /2)
    \end{bmatrix}
$$

This gate can be thought of as a `cirq.PhasedXPowGate` followed by a `cirq.ZPowGate`.

The axis phase exponent ($a$) decides which axis in the XY plane to rotate
around. The amount of rotation around that axis is decided by the x
exponent ($x$). Then the z exponent ($z$) decides how much to finally phase the qubit.

Every single qubit gate can be written as a single `cirq.PhasedXZGate`.

### `__init__`

```python
def __init__(self, *, x_exponent: float | sympy.Expr, z_exponent: float | sympy.Expr, axis_phase_exponent: float | sympy.Expr) -> None
```

Inits PhasedXZGate.

Args:
    x_exponent: Determines how much to rotate during the
        axis-in-XY-plane rotation. The $x$ in $Z^z Z^a X^x Z^{-a}$.
    z_exponent: The amount of phasing to apply after the
        axis-in-XY-plane rotation. The $z$ in $Z^z Z^a X^x Z^{-a}$.
    axis_phase_exponent: Determines which axis to rotate around during
        the axis-in-XY-plane rotation. The $a$ in $Z^z Z^a X^x Z^{-a}$.

### `from_zyz_angles`

```python
def from_zyz_angles(cls, z0_rad: float, y_rad: float, z1_rad: float) -> cirq.PhasedXZGate
```

Create a PhasedXZGate from ZYZ angles.

The returned gate is equivalent to $Rz(z0\_rad) Ry(y\_rad) Rz(z1\_rad)$ (in time order).

### `from_zyz_exponents`

```python
def from_zyz_exponents(cls, z0: float, y: float, z1: float) -> cirq.PhasedXZGate
```

Create a PhasedXZGate from ZYZ exponents.

The returned gate is equivalent to $Z^{z0} Y^y Z^{z1}$ (in time order).

### `canonical_clifford`

```python
def canonical_clifford(self) -> PhasedXZGate | None
```

Returns the exact Clifford gate if this gate's exponents are all within small errors.
