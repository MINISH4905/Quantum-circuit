---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/phased_iswap_gate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/phased_iswap_gate.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/phased_iswap_gate.py`

ISWAPPowGate conjugated by tensor product Rz(phi) and Rz(-phi).

## `PhasedISwapPowGate`

```python
class PhasedISwapPowGate(eigen_gate.EigenGate)
```

Fractional ISWAP conjugated by Z rotations.

PhasedISwapPowGate with phase_exponent p and exponent t is equivalent to
the composition

    (Z^-p ⊗ Z^p) ISWAP^t (Z^p ⊗ Z^-p)

and is given by the matrix:

$$
\begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & c & i s f & 0 \\
    0 & i s f^* & c & 0 \\
    0 & 0 & 0 & 1
\end{bmatrix}
$$

where:

$$
c = \cos\left(\frac{\pi t}{2}\right)
$$
$$
s = \sin\left(\frac{\pi t}{2}\right)
$$
$$
f = e^{2 \pi p i}
$$

### `__init__`

```python
def __init__(self, *, phase_exponent: float | sympy.Expr=0.25, exponent: float | sympy.Expr=1.0, global_shift: float=0.0)
```

Inits PhasedISwapPowGate.

Args:
    phase_exponent: The exponent on the Z gates. We conjugate by
        the T gate by default.
    exponent: The exponent on the ISWAP gate, see EigenGate for
        details.
    global_shift: The global_shift on the ISWAP gate, see EigenGate for
        details.

## `givens`

```python
def givens(angle_rads: value.TParamVal) -> PhasedISwapPowGate
```

Returns gate with matrix exp(-i angle_rads (Y⊗X - X⊗Y) / 2).

In numerical linear algebra Givens rotation is any linear transformation
with matrix equal to the identity except for a 2x2 orthogonal submatrix
[[cos(a), -sin(a)], [sin(a), cos(a)]] which performs a 2D rotation on a
subspace spanned by two basis vectors. In quantum computational chemistry
the term is used to refer to the two-qubit gate defined as

    givens(a) ≡ exp(-i a (Y⊗X - X⊗Y) / 2)

with the matrix

    [[1, 0, 0, 0],
     [0, c, -s, 0],
     [0, s, c, 0],
     [0, 0, 0, 1]]

where

    c = cos(a),
    s = sin(a).

The matrix is a Givens rotation in the numerical linear algebra sense
acting on the subspace spanned by the |01⟩ and |10⟩ states.

The gate is also equivalent to the ISWAP conjugated by T^-1 ⊗ T.


Args:
    angle_rads: The rotation angle in radians.

Returns:
    A phased iswap gate for the given rotation.
