---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/rx.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/rx.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/rx.py`

Rotation around the X axis.

## `RXGate`

```python
class RXGate(Gate)
```

Single-qubit rotation about the X axis.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.rx` method.

Circuit symbol:

.. code-block:: text

         ┌───────┐
    q_0: ┤ Rx(ϴ) ├
         └───────┘

Matrix representation:

.. math::

    \newcommand{\rotationangle}{\frac{\theta}{2}}

    RX(\theta) = \exp\left(-i \rotationangle X\right) =
        \begin{pmatrix}
            \cos\left(\rotationangle\right)   & -i\sin\left(\rotationangle\right) \\
            -i\sin\left(\rotationangle\right) & \cos\left(\rotationangle\right)
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

Return a controlled version of the RX gate.

For a single control qubit, the controlled gate is implemented as :class:`.CRXGate`,
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

Return inverted RX gate.

:math:`RX(\lambda)^{\dagger} = RX(-\lambda)`

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.RXGate` with an inverted parameter value.

Returns:
    RXGate: inverse gate.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a numpy.array for the RX gate.

## `CRXGate`

```python
class CRXGate(ControlledGate)
```

Controlled-RX gate.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.crx` method.

Circuit symbol:

.. code-block:: text

    q_0: ────■────
         ┌───┴───┐
    q_1: ┤ Rx(ϴ) ├
         └───────┘

Matrix representation:

.. math::

    \newcommand{\rotationangle}{\frac{\theta}{2}}

    CRX(\theta)\ q_0, q_1 =
        I \otimes |0\rangle\langle 0| + RX(\theta) \otimes |1\rangle\langle 1| =
        \begin{pmatrix}
            1 & 0 & 0 & 0 \\
            0 & \cos\left(\rotationangle\right) & 0 & -i\sin\left(\rotationangle\right) \\
            0 & 0 & 1 & 0 \\
            0 & -i\sin\left(\rotationangle\right) & 0 & \cos\left(\rotationangle\right)
        \end{pmatrix}

.. note::

    In Qiskit's convention, higher qubit indices are more significant
    (little endian convention). In many textbooks, controlled gates are
    presented with the assumption of more significant qubits as control,
    which in our case would be q_1. Thus a textbook matrix for this
    gate will be:

    .. code-block:: text

             ┌───────┐
        q_0: ┤ Rx(ϴ) ├
             └───┬───┘
        q_1: ────■────

    .. math::

        \newcommand{\rotationangle}{\frac{\theta}{2}}

        CRX(\theta)\ q_1, q_0 =
        |0\rangle\langle0| \otimes I + |1\rangle\langle1| \otimes RX(\theta) =
            \begin{pmatrix}
                1 & 0 & 0 & 0 \\
                0 & 1 & 0 & 0 \\
                0 & 0 & \cos\left(\rotationangle\right)   & -i\sin\left(\rotationangle\right) \\
                0 & 0 & -i\sin\left(\rotationangle\right) & \cos\left(\rotationangle\right)
            \end{pmatrix}

### `__init__`

```python
def __init__(self, theta: ParameterValueType, label: str | None=None, ctrl_state: int | str | None=None, *, _base_label=None)
```

Create new CRX gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverse CRX gate (i.e. with the negative rotation angle).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.CRXGate` with an inverted parameter value.

Returns:
    CRXGate: inverse gate.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a numpy.array for the CRX gate.
