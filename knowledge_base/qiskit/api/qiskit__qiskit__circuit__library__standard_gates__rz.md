---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/rz.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/rz.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/rz.py`

Rotation around the Z axis.

## `RZGate`

```python
class RZGate(Gate)
```

Single-qubit rotation about the Z axis.

This is a diagonal gate. It can be implemented virtually in hardware
via framechanges (i.e. at zero error and duration).

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.rz` method.

Circuit symbol:

.. code-block:: text

         ┌───────┐
    q_0: ┤ Rz(φ) ├
         └───────┘

Matrix representation:

.. math::

    RZ(\phi) = \exp\left(-i\frac{\phi}{2}Z\right) =
        \begin{pmatrix}
            e^{-i\frac{\phi}{2}} & 0 \\
            0 & e^{i\frac{\phi}{2}}
        \end{pmatrix}

.. seealso::

    :class:`~qiskit.circuit.library.standard_gates.U1Gate`
    This gate is equivalent to U1 up to a phase factor.

        .. math::

            U1(\theta=\phi) = e^{i{\phi}/2}RZ(\phi)

    Reference for virtual Z gate implementation:
    `1612.00858 <https://arxiv.org/abs/1612.00858>`_

### `__init__`

```python
def __init__(self, phi: ParameterValueType, label: str | None=None)
```

Args:
    phi: The rotation angle.
    label: An optional label for the gate.

### `control`

```python
def control(self, num_ctrl_qubits: int=1, label: str | None=None, ctrl_state: str | int | None=None, annotated: bool | None=None)
```

Return a controlled version of the RZ gate.

For a single control qubit, the controlled gate is implemented as :class:`.CRZGate`,
regardless of the value of `annotated`.

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

Return inverted RZ gate

:math:`RZ(\lambda)^{\dagger} = RZ(-\lambda)`

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.RZGate` with an inverted parameter value.

Returns:
    RZGate: inverse gate.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a numpy.array for the RZ gate.

## `CRZGate`

```python
class CRZGate(ControlledGate)
```

Controlled-RZ gate.

This is a diagonal but non-symmetric gate that induces a
phase on the state of the target qubit, depending on the control state.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.crz` method.

Circuit symbol:

.. code-block:: text

    q_0: ────■────
         ┌───┴───┐
    q_1: ┤ Rz(θ) ├
         └───────┘

Matrix representation:

.. math::

    CRZ(\theta)\ q_0, q_1 =
        I \otimes |0\rangle\langle 0| + RZ(\phi=\theta) \otimes |1\rangle\langle 1| =
        \begin{pmatrix}
            1 & 0 & 0 & 0 \\
            0 & e^{-i\frac{\theta}{2}} & 0 & 0 \\
            0 & 0 & 1 & 0 \\
            0 & 0 & 0 & e^{i\frac{\theta}{2}}
        \end{pmatrix}

.. note::

    In Qiskit's convention, higher qubit indices are more significant
    (little endian convention). In many textbooks, controlled gates are
    presented with the assumption of more significant qubits as control,
    which in our case would be q_1. Thus a textbook matrix for this
    gate will be:

    .. code-block:: text

             ┌───────┐
        q_0: ┤ Rz(θ) ├
             └───┬───┘
        q_1: ────■────

    .. math::

        CRZ(\theta)\ q_1, q_0 =
            |0\rangle\langle 0| \otimes I + |1\rangle\langle 1| \otimes RZ(\theta) =
            \begin{pmatrix}
                1 & 0 & 0 & 0 \\
                0 & 1 & 0 & 0 \\
                0 & 0 & e^{-i\frac{\theta}{2}} & 0 \\
                0 & 0 & 0 & e^{i\frac{\theta}{2}}
            \end{pmatrix}

.. seealso::

    :class:`~qiskit.circuit.library.standard_gates.CU1Gate`:
    Due to the global phase difference in the matrix definitions
    of U1 and RZ, CU1 and CRZ are different gates with a relative
    phase difference.

### `__init__`

```python
def __init__(self, theta: ParameterValueType, label: str | None=None, ctrl_state: int | str | None=None, *, _base_label=None)
```

Create new CRZ gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverse CRZ gate (i.e. with the negative rotation angle).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.CRZGate` with an inverted parameter value.

 Returns:
    CRZGate: inverse gate.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a numpy.array for the CRZ gate.
