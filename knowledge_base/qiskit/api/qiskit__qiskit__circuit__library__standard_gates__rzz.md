---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/rzz.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/rzz.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/rzz.py`

Two-qubit ZZ-rotation gate.

## `RZZGate`

```python
class RZZGate(Gate)
```

A parametric 2-qubit :math:`Z \otimes Z` interaction (rotation about ZZ).

This gate is symmetric, and is maximally entangling at :math:`\theta = \pi/2`.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.rzz` method.

Circuit symbol:

.. code-block:: text

    q_0: ───■────
            │zz(θ)
    q_1: ───■────

Matrix representation:

.. math::

    \newcommand{\rotationangle}{\frac{\theta}{2}}

    R_{ZZ}(\theta) = \exp\left(-i \rotationangle Z{\otimes}Z\right) =
        \begin{pmatrix}
            e^{-i \rotationangle} & 0 & 0 & 0 \\
            0 & e^{i \rotationangle} & 0 & 0 \\
            0 & 0 & e^{i \rotationangle} & 0 \\
            0 & 0 & 0 & e^{-i \rotationangle}
        \end{pmatrix}

This is a direct sum of RZ rotations, so this gate is equivalent to a
uniformly controlled (multiplexed) RZ gate:

.. math::

    R_{ZZ}(\theta) =
        \begin{pmatrix}
            RZ(\theta) & 0 \\
            0 & RZ(-\theta)
        \end{pmatrix}

Examples:

.. math::

    R_{ZZ}(\theta = 0) = I

.. math::

    R_{ZZ}(\theta = 2\pi) = -I

.. math::

    R_{ZZ}(\theta = \pi) = - i Z \otimes Z

.. math::

    R_{ZZ}\left(\theta = \frac{\pi}{2}\right) = \frac{1}{\sqrt{2}}
                            \begin{pmatrix}
                                1-i & 0 & 0 & 0 \\
                                0 & 1+i & 0 & 0 \\
                                0 & 0 & 1+i & 0 \\
                                0 & 0 & 0 & 1-i
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

Return inverse RZZ gate (i.e. with the negative rotation angle).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.RZZGate` with an inverted parameter value.

Returns:
    RZZGate: inverse gate.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a numpy.array for the RZZ gate.
