---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/parity_gates.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/parity_gates.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/parity_gates.py`

Quantum gates that phase with respect to product-of-pauli observables.

## `XXPowGate`

```python
class XXPowGate(gate_features.InterchangeableQubitsGate, eigen_gate.EigenGate)
```

The X-parity gate, possibly raised to a power.

The XX**t gate implements the following unitary:

$$
(X \otimes X)^t = \begin{bmatrix}
                  c & 0 & 0 & s \\
                  0 & c & s & 0 \\
                  0 & s & c & 0 \\
                  s & 0 & 0 & c
                  \end{bmatrix}
$$

where

$$
c = f \cos\left(\frac{\pi t}{2}\right)
$$

$$
s = -i f \sin\left(\frac{\pi t}{2}\right)
$$

$$
f = e^{\frac{i \pi t}{2}}.
$$

See also: `cirq.ops.MSGate` (the Mølmer–Sørensen gate), which is
implemented via this class.

## `YYPowGate`

```python
class YYPowGate(gate_features.InterchangeableQubitsGate, eigen_gate.EigenGate)
```

The Y-parity gate, possibly raised to a power.

The YY**t gate implements the following unitary:

$$
(Y \otimes Y)^t = \begin{bmatrix}
                  c & 0 & 0 & -s \\
                  0 & c & s & 0 \\
                  0 & s & c & 0 \\
                  -s & 0 & 0 & c \\
                  \end{bmatrix}
$$

where

$$
c = f \cos\left(\frac{\pi t}{2}\right)
$$

$$
s = -i f \sin\left(\frac{\pi t}{2}\right)
$$

$$
f = e^{\frac{i \pi t}{2}}.
$$

## `ZZPowGate`

```python
class ZZPowGate(gate_features.InterchangeableQubitsGate, eigen_gate.EigenGate)
```

The Z-parity gate, possibly raised to a power.

The ZZ**t gate implements the following unitary:

$$
(Z \otimes Z)^t = \begin{bmatrix}
                  1 & & & \\
                  & e^{i \pi t} & & \\
                  & & e^{i \pi t} & \\
                  & & & 1
                  \end{bmatrix}
$$

## `MSGate`

```python
class MSGate(XXPowGate)
```

The Mølmer–Sørensen gate, a native two-qubit operation in ion traps.

A rotation around the XX axis in the two-qubit bloch sphere.

The gate implements the following unitary:

    exp(-i t XX) = [ cos(t)   0        0       -isin(t)]
                   [ 0        cos(t)  -isin(t)  0      ]
                   [ 0       -isin(t)  cos(t)   0      ]
                   [-isin(t)  0        0        cos(t) ]

## `ms`

```python
def ms(rads: float) -> MSGate
```

A helper to construct the `cirq.MSGate` for the given angle specified in radians.

Args:
    rads: The rotation angle in radians.

Returns:
    Mølmer–Sørensen gate rotating by the desired amount.
