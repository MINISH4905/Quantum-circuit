---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/u3.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/u3.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/u3.py`

Two-pulse single-qubit gate.

## `U3Gate`

```python
class U3Gate(Gate)
```

Generic single-qubit rotation gate with 3 Euler angles.

.. warning::

   This gate is deprecated. Instead, the following replacements should be used

   .. math::

       U3(\theta, \phi, \lambda) = U(\theta, \phi, \lambda)

   .. code-block:: python

      circuit = QuantumCircuit(1)
      circuit.u(theta, phi, lambda)

Circuit symbol:

.. code-block:: text

         ┌───────────┐
    q_0: ┤ U3(ϴ,φ,λ) ├
         └───────────┘

Matrix representation:

.. math::

    \newcommand{\rotationangle}{\frac{\theta}{2}}

    U3(\theta, \phi, \lambda) =
        \begin{pmatrix}
            \cos\left(\rotationangle\right) & -e^{i\lambda}\sin\left(\rotationangle\right) \\
            e^{i\phi}\sin\left(\rotationangle\right) &
            e^{i(\phi+\lambda)}\cos\left(\rotationangle\right)
        \end{pmatrix}

.. note::

    The matrix representation shown here differs from the `OpenQASM 2.0 specification
    <https://doi.org/10.48550/arXiv.1707.03429>`_ by a global phase of
    :math:`e^{i(\phi+\lambda)/2}`.

Examples:

.. math::

    U3(\theta, \phi, \lambda) = P(\phi) R_Y(\theta) P(\lambda)
    = e^{i\frac{\phi + \lambda}{2}} R_Z(\phi) R_Y(\theta) R_Z(\lambda)

.. math::

    U3\left(\theta, -\frac{\pi}{2}, \frac{\pi}{2}\right) = RX(\theta)

.. math::

    U3(\theta, 0, 0) = RY(\theta)

### `__init__`

```python
def __init__(self, theta: ParameterValueType, phi: ParameterValueType, lam: ParameterValueType, label: str | None=None)
```

Args:
    theta: The angle :math:`\theta` corresponding to the :math:`R_Y(\theta)` rotation.
    phi: The angle :math:`\phi` corresponding to the :math:`R_Z(\phi)` rotation.
    lam: The angle :math:`\lambda` corresponding to the :math:`R_Z(\lambda)` rotation.
    label: An optional label for the gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverted U3 gate.

:math:`U3(\theta,\phi,\lambda)^{\dagger} =U3(-\theta,-\lambda,-\phi))`

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.U3Gate` with inverse parameter values.

Returns:
    U3Gate: inverse gate.

### `control`

```python
def control(self, num_ctrl_qubits: int=1, label: str | None=None, ctrl_state: str | int | None=None, annotated: bool | None=None)
```

Return a controlled version of the U3 gate.

For a single control qubit, the controlled gate is implemented as :class:`.CU3Gate`,
regardless of the value of `annotated`.

For more than one control qubit,
the controlled gate is implemented as :class:`.ControlledGate` when ``annotated``
is ``False``, and as :class:`.AnnotatedOperation` when ``annotated`` is ``True``.
When ``annotated`` is ``None``, it is interpreted as ``True`` when the gate has free
parameters (in which case the gate cannot be synthesized at the construction time)
and as ``False`` otherwise.

Args:
    num_ctrl_qubits: Number of controls to add. Defaults to ``1``.
    label: Optional gate label. Defaults to ``None``.
        Ignored if the controlled gate is implemented as an annotated operation.
    ctrl_state: The control state of the gate, specified either as an integer or a bitstring
        (e.g. ``"110"``). If ``None``, defaults to the all-ones state ``2**num_ctrl_qubits - 1``.
    annotated: Indicates whether the controlled gate should be implemented as a controlled gate
        or as an annotated operation. If ``None``, treated as ``False``

Returns:
    A controlled version of this gate.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a Numpy.array for the U3 gate.

## `CU3Gate`

```python
class CU3Gate(ControlledGate)
```

Controlled-U3 gate (3-parameter two-qubit gate).

This is a controlled version of the U3 gate (generic single qubit rotation).
It is restricted to 3 parameters, and so cannot cover generic two-qubit
controlled gates).

.. warning::

   This gate is deprecated. Instead, the :class:`.CUGate` should be used

   .. math::

       CU3(\theta, \phi, \lambda) = CU(\theta, \phi, \lambda, 0)

   .. code-block:: python

      circuit = QuantumCircuit(2)
      gamma = 0
      circuit.cu(theta, phi, lambda, gamma, 0, 1)




Circuit symbol:

.. code-block:: text

    q_0: ──────■──────
         ┌─────┴─────┐
    q_1: ┤ U3(ϴ,φ,λ) ├
         └───────────┘

Matrix representation:

.. math::

    \newcommand{\rotationangle}{\frac{\theta}{2}}

    CU3(\theta, \phi, \lambda)\ q_0, q_1 =
        I \otimes |0\rangle\langle 0| +
        U3(\theta,\phi,\lambda) \otimes |1\rangle\langle 1| =
        \begin{pmatrix}
            1 & 0                   & 0 & 0 \\
            0 & \cos(\rotationangle)           & 0 & -e^{i\lambda}\sin(\rotationangle) \\
            0 & 0                   & 1 & 0 \\
            0 & e^{i\phi}\sin(\rotationangle)  & 0 & e^{i(\phi+\lambda)}\cos(\rotationangle)
        \end{pmatrix}

.. note::

    In Qiskit's convention, higher qubit indices are more significant
    (little endian convention). In many textbooks, controlled gates are
    presented with the assumption of more significant qubits as control,
    which in our case would be q_1. Thus a textbook matrix for this
    gate will be:

    .. code-block:: text

             ┌───────────┐
        q_0: ┤ U3(ϴ,φ,λ) ├
             └─────┬─────┘
        q_1: ──────■──────

    .. math::

        \newcommand{\rotationangle}{\frac{\theta}{2}}

        CU3(\theta, \phi, \lambda)\ q_1, q_0 =
            |0\rangle\langle 0| \otimes I +
            |1\rangle\langle 1| \otimes U3(\theta,\phi,\lambda) =
            \begin{pmatrix}
                1 & 0   & 0                  & 0 \\
                0 & 1   & 0                  & 0 \\
                0 & 0   & \cos(\rotationangle)          & -e^{i\lambda}\sin(\rotationangle) \\
                0 & 0   & e^{i\phi}\sin(\rotationangle) & e^{i(\phi+\lambda)}\cos(\rotationangle)
            \end{pmatrix}

### `__init__`

```python
def __init__(self, theta: ParameterValueType, phi: ParameterValueType, lam: ParameterValueType, label: str | None=None, ctrl_state: int | str | None=None, *, _base_label=None)
```

Create new CU3 gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverted CU3 gate.

:math:`CU3(\theta,\phi,\lambda)^{\dagger} =CU3(-\theta,-\phi,-\lambda))`

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.CU3Gate` with inverse
        parameter values.

Returns:
    CU3Gate: inverse gate.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a numpy.array for the CU3 gate.
