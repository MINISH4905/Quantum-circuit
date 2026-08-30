---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/h.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/h.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/h.py`

Hadamard gate.

## `HGate`

```python
class HGate(SingletonGate)
```

Single-qubit Hadamard gate.

This gate is a \pi rotation about the X+Z axis, and has the effect of
changing computation basis from :math:`|0\rangle,|1\rangle` to
:math:`|+\rangle,|-\rangle` and vice-versa.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.h` method.

Circuit symbol:

.. code-block:: text

         ┌───┐
    q_0: ┤ H ├
         └───┘

Matrix representation:

.. math::

    H = \frac{1}{\sqrt{2}}
        \begin{pmatrix}
            1 & 1 \\
            1 & -1
        \end{pmatrix}

### `__init__`

```python
def __init__(self, label: str | None=None)
```

Args:
    label: An optional label for the gate.

### `control`

```python
def control(self, num_ctrl_qubits: int=1, label: str | None=None, ctrl_state: int | str | None=None, annotated: bool | None=None)
```

Return a controlled version of the H gate.

For a single control qubit, the controlled gate is implemented as :class:`.CHGate`,
regardless of the value of `annotated`.

For more than one control qubit,
the controlled gate is implemented as :class:`.ControlledGate` when ``annotated``
is ``False``, and as :class:`.AnnotatedOperation` when ``annotated`` is ``True``.

Args:
    num_ctrl_qubits: Number of controls to add. Defaults to ``1``.
    label: Optional gate label. Defaults to ``None``.
        Ignored if the controlled gate is implemented as an annotated operation.
    ctrl_state: The control state of the gate, specified either as an integer or a bitstring
        (e.g. ``"110"``). If ``None``, defaults to the all-ones state ``2**num_ctrl_qubits - 1``.
    annotated: Indicates whether the controlled gate should be implemented as a controlled gate
        or as an annotated operation. If ``None``, treated as ``False``.

Returns:
    A controlled version of this gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverted H gate (itself).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as this gate
        is self-inverse.

Returns:
    HGate: inverse gate (self-inverse).

## `CHGate`

```python
class CHGate(SingletonControlledGate)
```

Controlled-Hadamard gate.

Applies a Hadamard on the target qubit if the control is
in the :math:`|1\rangle` state.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.ch` method.

Circuit symbol:

.. code-block:: text

    q_0: ──■──
         ┌─┴─┐
    q_1: ┤ H ├
         └───┘

Matrix representation:

.. math::

    CH\ q_0, q_1 =
        I \otimes |0\rangle\langle 0| + H \otimes |1\rangle\langle 1| =
        \begin{pmatrix}
            1 & 0 & 0 & 0 \\
            0 & \frac{1}{\sqrt{2}} & 0 & \frac{1}{\sqrt{2}} \\
            0 & 0 & 1 & 0 \\
            0 & \frac{1}{\sqrt{2}} & 0 & -\frac{1}{\sqrt{2}}
        \end{pmatrix}

.. note::

    In Qiskit's convention, higher qubit indices are more significant
    (little endian convention). In many textbooks, controlled gates are
    presented with the assumption of more significant qubits as control,
    which in our case would be q_1. Thus a textbook matrix for this
    gate will be:

    .. code-block:: text

             ┌───┐
        q_0: ┤ H ├
             └─┬─┘
        q_1: ──■──

    .. math::

        CH\ q_1, q_0 =
            |0\rangle\langle 0| \otimes I + |1\rangle\langle 1| \otimes H =
            \begin{pmatrix}
                1 & 0 & 0 & 0 \\
                0 & 1 & 0 & 0 \\
                0 & 0 & \frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\
                0 & 0 & \frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}}
            \end{pmatrix}

### `__init__`

```python
def __init__(self, label: str | None=None, ctrl_state: int | str | None=None, *, _base_label=None)
```

Create new CH gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverted CH gate (itself).
