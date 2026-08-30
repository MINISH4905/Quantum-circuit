---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/u2.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/u2.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/u2.py`

One-pulse single-qubit gate.

## `U2Gate`

```python
class U2Gate(Gate)
```

Single-qubit rotation about the X+Z axis.

Implemented using one X90 pulse on IBM Quantum systems:

.. warning::

   This gate is deprecated. Instead, the following replacements should be used

   .. math::

       U2(\phi, \lambda) = U\left(\frac{\pi}{2}, \phi, \lambda\right)

   .. code-block:: python

      circuit = QuantumCircuit(1)
      circuit.u(pi/2, phi, lambda)

Circuit symbol:

.. code-block:: text

         ┌─────────┐
    q_0: ┤ U2(φ,λ) ├
         └─────────┘

Matrix representation:

.. math::

    U2(\phi, \lambda) = \frac{1}{\sqrt{2}}
        \begin{pmatrix}
            1          & -e^{i\lambda} \\
            e^{i\phi} & e^{i(\phi+\lambda)}
        \end{pmatrix}

Examples:

.. math::

    U2(\phi,\lambda) = e^{i \frac{\phi + \lambda}{2}}RZ(\phi)
    RY\left(\frac{\pi}{2}\right) RZ(\lambda)
    = e^{- i\frac{\pi}{4}} P\left(\frac{\pi}{2} + \phi\right)
    \sqrt{X} P\left(\lambda- \frac{\pi}{2}\right)

.. math::

    U2(0, \pi) = H

.. math::

    U2(0, 0) = RY(\pi/2)

.. math::

    U2(-\pi/2, \pi/2) = RX(\pi/2)

.. seealso::

    :class:`~qiskit.circuit.library.standard_gates.U3Gate`:
    U3 is a generalization of U2 that covers all single-qubit rotations,
    using two X90 pulses.

### `__init__`

```python
def __init__(self, phi: ParameterValueType, lam: ParameterValueType, label: str | None=None)
```

Args:
    phi: The rotation angle :math:`\phi`.
    lam: The rotation angle :math:`\lambda`.
    label: An optional label for the gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverted U2 gate.

:math:`U2(\phi, \lambda)^{\dagger} =U2(-\lambda-\pi, -\phi+\pi))`

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.U2Gate` with inverse parameter values.

Returns:
    U2Gate: inverse gate.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a Numpy.array for the U2 gate.
