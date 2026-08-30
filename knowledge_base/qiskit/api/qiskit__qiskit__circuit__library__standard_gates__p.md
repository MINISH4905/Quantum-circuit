---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/p.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/p.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/p.py`

Phase Gate.

## `PhaseGate`

```python
class PhaseGate(Gate)
```

Single-qubit rotation about the Z axis.

This is a diagonal gate. It can be implemented virtually in hardware
via framechanges (i.e. at zero error and duration).

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.p` method.

Circuit symbol:

.. code-block:: text

         ┌──────┐
    q_0: ┤ P(θ) ├
         └──────┘

Matrix representation:

.. math::

    P(\theta) =
        \begin{pmatrix}
            1 & 0 \\
            0 & e^{i\theta}
        \end{pmatrix}

Examples:

    .. math::

        P(\theta = \pi) = Z

    .. math::

        P(\theta = \pi/2) = S

    .. math::

        P(\theta = \pi/4) = T

.. seealso::

    :class:`~qiskit.circuit.library.standard_gates.RZGate`:
    This gate is equivalent to RZ up to a phase factor.

        .. math::

            P(\theta) = e^{i{\theta}/2} RZ(\theta)

    Reference for virtual Z gate implementation:
    `1612.00858 <https://arxiv.org/abs/1612.00858>`_

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

Return a controlled version of the Phase gate.

For a single control qubit, the controlled gate is implemented as :class:`.CPhaseGate`.
For more than one control qubits, the controlled gate is implemented as :class:`.MCPhaseGate`.
In each case, the value of ``annotated`` is ignored.

Args:
    num_ctrl_qubits: Number of controls to add. Defaults to ``1``.
    label: Optional gate label. Defaults to ``None``.
    ctrl_state: The control state of the gate, specified either as an integer or a bitstring
        (e.g. ``"110"``). If ``None``, defaults to the all-ones state ``2**num_ctrl_qubits - 1``
    annotated: Ignored.

Returns:
    A controlled version of this gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverted Phase gate (:math:`Phase(\lambda)^{\dagger} = Phase(-\lambda)`)

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always another :class:`.PGate` with an inverse parameter value.

Returns:
    PGate: inverse gate.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a numpy.array for the Phase gate.

## `CPhaseGate`

```python
class CPhaseGate(ControlledGate)
```

Controlled-Phase gate.

This is a diagonal and symmetric gate that induces a
phase on the state of the target qubit, depending on the control state.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.cp` method.

Circuit symbol:

.. code-block:: text


    q_0: ─■──
          │θ
    q_1: ─■──


Matrix representation:

.. math::

    CPhase =
        I \otimes |0\rangle\langle 0| + P \otimes |1\rangle\langle 1| =
        \begin{pmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 0 & 1 & 0 \\
            0 & 0 & 0 & e^{i\theta}
        \end{pmatrix}

.. seealso::

    :class:`~qiskit.circuit.library.standard_gates.CRZGate`:
    Due to the global phase difference in the matrix definitions
    of Phase and RZ, CPhase and CRZ are different gates with a relative
    phase difference.

### `__init__`

```python
def __init__(self, theta: ParameterValueType, label: str | None=None, ctrl_state: str | int | None=None, *, _base_label=None)
```

Create new CPhase gate.

### `control`

```python
def control(self, num_ctrl_qubits: int=1, label: str | None=None, ctrl_state: str | int | None=None, annotated: bool | None=None)
```

Return a controlled version of the CPhase gate.

The controlled gate is implemented as :class:`.MCPhaseGate`, regardless of
the value of ``annotated``.

Args:
    num_ctrl_qubits: Number of controls to add. Defaults to ``1``.
    label: Optional gate label. Defaults to ``None``.
    ctrl_state: The control state of the gate, specified either as an integer or a bitstring
        (e.g. ``"110"``). If ``None``, defaults to the all-ones state ``2**num_ctrl_qubits - 1``
    annotated: Ignored.

Returns:
    A controlled version of this gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverted CPhase gate (:math:`CPhase(\lambda)^{\dagger} = CPhase(-\lambda)`)

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a numpy.array for the CPhase gate.

## `MCPhaseGate`

```python
class MCPhaseGate(ControlledGate)
```

Multi-controlled-Phase gate.

This is a diagonal and symmetric gate that induces a
phase on the state of the target qubit, depending on the state of the control qubits.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.mcp` method.

Circuit symbol:

.. code-block:: text

        q_0: ───■────
                │
                .
                │
    q_(n-1): ───■────
             ┌──┴───┐
        q_n: ┤ P(λ) ├
             └──────┘

.. seealso::

    :class:`~qiskit.circuit.library.standard_gates.CPhaseGate`:
    The singly-controlled-version of this gate.

### `__init__`

```python
def __init__(self, lam: ParameterValueType, num_ctrl_qubits: int, label: str | None=None, ctrl_state: str | int | None=None, *, _base_label=None)
```

Create new MCPhase gate.

### `control`

```python
def control(self, num_ctrl_qubits: int=1, label: str | None=None, ctrl_state: str | int | None=None, annotated: bool | None=None)
```

Return a controlled version of the MCPhaseGate gate.


The controlled gate is implemented as :class:`.MCPhaseGate`, regardless of
the value of ``annotated``.

Args:
    num_ctrl_qubits: Number of controls to add. Defaults to ``1``.
    label: Optional gate label. Defaults to ``None``.
    ctrl_state: The control state of the gate, specified either as an integer or a bitstring
        (e.g. ``"110"``). If ``None``, defaults to the all-ones state ``2**num_ctrl_qubits - 1``
    annotated: Ignored.

Returns:
    A controlled version of this gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverted MCPhase gate (:math:`MCPhase(\lambda)^{\dagger} = MCPhase(-\lambda)`)
