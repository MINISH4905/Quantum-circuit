---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/xx_minus_yy.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/xx_minus_yy.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/xx_minus_yy.py`

Two-qubit XX-YY gate.

## `XXMinusYYGate`

```python
class XXMinusYYGate(Gate)
```

XX-YY interaction gate.

A 2-qubit parameterized XX-YY interaction. Its action is to induce
a coherent rotation by some angle between :math:`|00\rangle` and :math:`|11\rangle`.

Circuit symbol:

.. code-block:: text

         ┌───────────────┐
    q_0: ┤0              ├
         │  (XX-YY)(θ,β) │
    q_1: ┤1              ├
         └───────────────┘

Matrix representation:

.. math::

    \newcommand{\rotationangle}{\frac{\theta}{2}}

    R_{XX-YY}(\theta, \beta) q_0, q_1 =
      RZ_1(\beta) \cdot \exp\left(-i \frac{\theta}{2} \frac{XX-YY}{2}\right) \cdot RZ_1(-\beta) =
        \begin{pmatrix}
            \cos\left(\rotationangle\right) & 0 & 0 & -i\sin\left(\rotationangle\right)e^{-i\beta} \\
            0 & 1 & 0 & 0 \\
            0 & 0 & 1 & 0 \\
            -i\sin\left(\rotationangle\right)e^{i\beta} & 0 & 0 & \cos\left(\rotationangle\right)
        \end{pmatrix}

### `__init__`

```python
def __init__(self, theta: ParameterValueType, beta: ParameterValueType=0, label: str | None='(XX-YY)')
```

Args:
    theta: The rotation angle.
    beta: The phase angle.
    label: The label of the gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Inverse gate.

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.XXMinusYYGate` with inverse
        parameter values.

Returns:
    XXMinusYYGate: inverse gate.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Gate matrix.
