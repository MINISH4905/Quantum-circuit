---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/ryy.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/ryy.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/ryy.py`

Two-qubit YY-rotation gate.

## `RYYGate`

```python
class RYYGate(Gate)
```

A parametric 2-qubit :math:`Y \otimes Y` interaction (rotation about YY).

This gate is symmetric, and is maximally entangling at :math:`\theta = \pi/2`.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.ryy` method.

Circuit symbol:

.. code-block:: text

         ┌─────────┐
    q_0: ┤1        ├
         │  Ryy(ϴ) │
    q_1: ┤0        ├
         └─────────┘

Matrix representation:

.. math::

    \newcommand{\rotationangle}{\frac{\theta}{2}}

    R_{YY}(\theta) = \exp\left(-i \rotationangle Y{\otimes}Y\right) =
        \begin{pmatrix}
            \cos\left(\rotationangle\right) & 0 & 0 & i\sin\left(\rotationangle\right) \\
            0 & \cos\left(\rotationangle\right) & -i\sin\left(\rotationangle\right) & 0 \\
            0 & -i\sin\left(\rotationangle\right) & \cos\left(\rotationangle\right) & 0 \\
            i\sin\left(\rotationangle\right) & 0 & 0 & \cos\left(\rotationangle\right)
        \end{pmatrix}

Examples:

.. math::

    R_{YY}(\theta = 0) = I 

.. math::

    R_{YY}(\theta = \pi) = -i Y \otimes Y

.. math::

    R_{YY}\left(\theta = \frac{\pi}{2}\right) = \frac{1}{\sqrt{2}}
                            \begin{pmatrix}
                                1 & 0 & 0 & i \\
                                0 & 1 & -i & 0 \\
                                0 & -i & 1 & 0 \\
                                i & 0 & 0 & 1
                            \end{pmatrix}

### `__init__`

```python
def __init__(self, theta: ParameterValueType, label: str | None=None)
```

Args:
    theta: The rotation angle.
    label: An optional label for the gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverse RYY gate (i.e. with the negative rotation angle).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.RYYGate` with an inverted parameter value.

Returns:
    RYYGate: inverse gate.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a numpy.array for the RYY gate.
