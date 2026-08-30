---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/phased_x_gate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/phased_x_gate.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/phased_x_gate.py`

An `XPowGate` conjugated by `ZPowGate`s.

## `PhasedXPowGate`

```python
class PhasedXPowGate(raw_types.Gate)
```

A gate equivalent to $Z^{-p} X^t Z^{p}$ (in time order).

The unitary matrix of `cirq.PhasedXPowGate(exponent=t, phase_exponent=p)` is:
$$
    \begin{bmatrix}
        e^{i \pi t /2} \cos(\pi t/2) & -i e^{i \pi (t /2 - p)} \sin(\pi t /2) \\
        -i e^{i \pi (t /2 + p)} \sin(\pi t /2) & e^{i \pi t /2} \cos(\pi t/2)
    \end{bmatrix}
$$

This gate is like an `cirq.XPowGate`, but which has been "phased",
by applying a `cirq.ZPowGate` before and after this gate. In the language
of the Bloch sphere, $p$ determines the axis in the XY plane about which
a rotation of amount determined by $t$ occurs.

### `__init__`

```python
def __init__(self, *, phase_exponent: float | sympy.Expr, exponent: float | sympy.Expr=1.0, global_shift: float=0.0) -> None
```

Inits PhasedXPowGate.

Args:
    phase_exponent: The exponent on the Z gates conjugating the X gate.
    exponent: The exponent on the X gate conjugated by Zs.
    global_shift: How much to shift the operation's eigenvalues at
        exponent=1.

### `exponent`

```python
def exponent(self) -> float | sympy.Expr
```

The exponent on the central X gate conjugated by the Z gates.

### `phase_exponent`

```python
def phase_exponent(self) -> float | sympy.Expr
```

The exponent on the Z gates conjugating the X gate.
