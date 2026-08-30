---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/rxx.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/rxx.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/rxx.py`

Two-qubit XX-rotation gate.

## `RXXGate`

```python
class RXXGate(Gate)
```

A parametric 2-qubit :math:`X \otimes X` interaction (rotation about XX).

This gate is symmetric, and is maximally entangling at :math:`\theta = \pi/2`.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.rxx` method.

Circuit symbol:

.. code-block:: text

         ┌─────────┐
    q_0: ┤1        ├
         │  Rxx(ϴ) │
    q_1: ┤0        ├
         └─────────┘

Matrix representation:

.. math::

    \newcommand{\rotationangle}{\frac{\theta}{2}}

    R_{XX}(\theta) = \exp\left(-i \rotationangle X{\otimes}X\right) =
        \begin{pmatrix}
            \cos\left(\rotationangle\right) & 0 & 0 & -i\sin\left(\rotationangle\right) \\
            0 & \cos\left(\rotationangle\right) & -i\sin\left(\rotationangle\right) & 0 \\
            0 & -i\sin\left(\rotationangle\right) & \cos\left(\rotationangle\right) & 0 \\
            -i\sin\left(\rotationangle\right) & 0 & 0 & \cos\left(\rotationangle\right)
        \end{pmatrix}

Examples:

.. math::

    R_{XX}(\theta = 0) = I

.. math::

    R_{XX}(\theta = \pi) = -i X \otimes X

.. math::

    R_{XX}\left(\theta = \frac{\pi}{2}\right) = \frac{1}{\sqrt{2}}
                            \begin{pmatrix}
                                1  & 0  & 0  & -i \\
                                0  & 1  & -i & 0 \\
                                0  & -i & 1  & 0 \\
                                -i & 0  & 0  & 1
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

Return inverse RXX gate (i.e. with the negative rotation angle).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.RXXGate` with an inverted parameter value.

Returns:
    RXXGate: inverse gate.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a Numpy.array for the RXX gate.
