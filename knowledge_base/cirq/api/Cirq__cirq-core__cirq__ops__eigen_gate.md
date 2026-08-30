---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/eigen_gate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/eigen_gate.py
license: Apache-2.0
---

## `EigenGate`

```python
class EigenGate(raw_types.Gate)
```

A gate with a known eigendecomposition.

EigenGate is particularly useful when one wishes for different parts of
the same eigenspace to be extrapolated differently. For example, if a gate
has a 2-dimensional eigenspace with eigenvalue -1, but one wishes for the
square root of the gate to split this eigenspace into a part with
eigenvalue i and a part with eigenvalue -i, then EigenGate allows this
functionality to be unambiguously specified via the _eigen_components
method.

The eigenvalue of each eigenspace of a gate is computed by:

1. Starting with an angle in half turns as returned by the gate's
    ``_eigen_components`` method:

            θ

2. Shifting the angle by `global_shift`:

            θ + s

3. Scaling the angle by `exponent`:

            (θ + s) * e

4. Converting from half turns to a complex number on the unit circle:

            exp(i * pi * (θ + s) * e)

### `__init__`

```python
def __init__(self, *, exponent: value.TParamVal=1.0, global_shift: float=0.0) -> None
```

Initializes the parameters used to compute the gate's matrix.

Args:
    exponent: The t in gate**t. Determines how much the eigenvalues of
        the gate are phased by. For example, eigenvectors phased by -1
        when `gate**1` is applied will gain a relative phase of
        e^{i pi exponent} when `gate**exponent` is applied (relative to
        eigenvectors unaffected by `gate**1`).
    global_shift: Offsets the eigenvalues of the gate at exponent=1.
        In effect, this controls a global phase factor on the gate's
        unitary matrix. The factor is:

            exp(i * pi * global_shift * exponent)

        For example, `cirq.X**t` uses a `global_shift` of 0 but
        `cirq.rx(t)` uses a `global_shift` of -0.5, which is why
        `cirq.unitary(cirq.rx(pi))` equals -iX instead of X.

Raises:
    TypeError: If the supplied exponent is a string.
    ValueError: If the supplied exponent is a complex number with an
        imaginary component.
