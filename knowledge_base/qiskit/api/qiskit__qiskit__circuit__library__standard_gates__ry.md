---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/ry.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/ry.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/ry.py`

Rotation around the Y axis.

## `RYGate`

```python
class RYGate(Gate)
```

Single-qubit rotation about the Y axis.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.ry` method.

Circuit symbol:

.. code-block:: text

         ┌───────┐
    q_0: ┤ Ry(ϴ) ├
         └───────┘

Matrix representation:

.. math::

    \newcommand{\rotationangle}{\frac{\theta}{2}}

    RY(\theta) = \exp\left(-i \rotationangle Y\right) =
        \begin{pmatrix}
            \cos\left(\rotationangle\right) & -\sin\left(\rotationangle\right) \\
            \sin\left(\rotationangle\right) & \cos\left(\rotationangle\right)
        \end{pmatrix}

### `__init__`

```python
def __init__(self, theta: ParameterValueType, label: str | None=None)
```

Args:
    theta: The rotation angle.
    label: An optional label for the gate.

### `control`

```python
def control(self, num_ctrl_qubits: int=1, label: str | None=None, ctrl_state: str | int | None=None, annotated: bool | None=None)
```

Return a controlled version of the RY gate.

For a single control qubit, the controlled gate is implemented as :class:`.CRYGate`,
regardless of the value of ``annotated``.

For more than one control qubit, the controlled gate is implemented
either as :class:`.ControlledGate` when ``annotated`` is ``False``, or
as :class:`.AnnotatedOperation` when ``annotated`` is ``True``.
When ``annotated`` is ``None``, it is interpreted as ``True`` when the gate has free
parameters (in which case the gate cannot be synthesized at the construction time),
and as ``False`` otherwise.

Args:
    num_ctrl_qubits: Number of controls to add. Defaults to ``1``.
    label: Optional gate label. Defaults to ``None``.
    ctrl_state: The control state of the gate, specified either as an integer or a bitstring
        (e.g. ``"110"``). If ``None``, defaults to the all-ones state ``2**num_ctrl_qubits - 1``
    annotated: Indicates whether the controlled gate should be implemented as a controlled gate
        or as an annotated operation.

Returns:
    A controlled version of this gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverse RY gate.

:math:`RY(\lambda)^{\dagger} = RY(-\lambda)`

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.RYGate` with an inverted parameter value.

Returns:
    RYGate: inverse gate.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a numpy.array for the RY gate.

## `CRYGate`

```python
class CRYGate(ControlledGate)
```

Controlled-RY gate.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.cry` method.

Circuit symbol:

.. code-block:: text

    q_0: ────■────
         ┌───┴───┐
    q_1: ┤ Ry(ϴ) ├
         └───────┘

Matrix representation:

.. math::

    \newcommand{\rotationangle}{\frac{\theta}{2}}

    CRY(\theta)\ q_0, q_1 =
        I \otimes |0\rangle\langle 0| + RY(\theta) \otimes |1\rangle\langle 1| =
        \begin{pmatrix}
            1 & 0         & 0 & 0 \\
            0 & \cos\left(\rotationangle\right) & 0 & -\sin\left(\rotationangle\right) \\
            0 & 0         & 1 & 0 \\
            0 & \sin\left(\rotationangle\right) & 0 & \cos\left(\rotationangle\right)
        \end{pmatrix}

.. note::

    In Qiskit's convention, higher qubit indices are more significant
    (little endian convention). In many textbooks, controlled gates are
    presented with the assumption of more significant qubits as control,
    which in our case would be q_1. Thus a textbook matrix for this
    gate will be:

    .. code-block:: text

             ┌───────┐
        q_0: ┤ Ry(ϴ) ├
             └───┬───┘
        q_1: ────■────

    .. math::

        \newcommand{\rotationangle}{\frac{\theta}{2}}

        CRY(\theta)\ q_1, q_0 =
        |0\rangle\langle 0| \otimes I + |1\rangle\langle 1| \otimes RY(\theta) =
            \begin{pmatrix}
                1 & 0 & 0 & 0 \\
                0 & 1 & 0 & 0 \\
                0 & 0 & \cos\left(\rotationangle\right) & -\sin\left(\rotationangle\right) \\
                0 & 0 & \sin\left(\rotationangle\right) & \cos\left(\rotationangle\right)
            \end{pmatrix}

### `__init__`

```python
def __init__(self, theta: ParameterValueType, label: str | None=None, ctrl_state: int | str | None=None, *, _base_label=None)
```

Create new CRY gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverse CRY gate (i.e. with the negative rotation angle)

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.CRYGate` with an inverted parameter value.

Returns:
    CRYGate: inverse gate.
.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a numpy.array for the CRY gate.
