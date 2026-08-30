---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/u1.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/u1.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/u1.py`

U1 Gate.

## `U1Gate`

```python
class U1Gate(Gate)
```

Single-qubit rotation about the Z axis.

This is a diagonal gate. It can be implemented virtually in hardware
via framechanges (i.e. at zero error and duration).

.. warning::

   This gate is deprecated. Instead, the following replacements should be used

   .. math::

       U1(\theta) = P(\theta)= U(0,0,\theta)

   .. code-block:: python

      circuit = QuantumCircuit(1)
      circuit.p(lambda, 0) # or circuit.u(0, 0, lambda, 0)

Circuit symbol:

.. code-block:: text

         ┌───────┐
    q_0: ┤ U1(θ) ├
         └───────┘

Matrix representation:

.. math::

    U1(\theta) =
        \begin{pmatrix}
            1 & 0 \\
            0 & e^{i\theta}
        \end{pmatrix}

Examples:

.. math::

    U1(\theta = \pi) = Z

.. math::

    U1(\theta = \pi/2) = S

.. math::

    U1(\theta = \pi/4) = T

.. seealso::

    :class:`~qiskit.circuit.library.standard_gates.RZGate`:
    This gate is equivalent to RZ up to a phase factor.

        .. math::

            U1(\theta) = e^{i{\theta}/2} RZ(\theta)

    :class:`~qiskit.circuit.library.standard_gates.U3Gate`:
    U3 is a generalization of U2 that covers all single-qubit rotations,
    using two X90 pulses.

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

Return a controlled version of the U1 gate.

For a single control qubit, the controlled gate is implemented as :class:`.CU1Gate`.
For more than one control qubits, the controlled gate is implemented as :class:`.MCU1Gate`.
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

Return inverted U1 gate (:math:`U1(\lambda)^{\dagger} = U1(-\lambda))`

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.U1Gate` with inverse parameter values.

Returns:
    U1Gate: inverse gate.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a numpy.array for the U1 gate.

## `CU1Gate`

```python
class CU1Gate(ControlledGate)
```

Controlled-U1 gate.

This is a diagonal and symmetric gate that induces a
phase on the state of the target qubit, depending on the control state.

.. warning::

   This gate is deprecated. Instead, the :class:`.CPhaseGate` should be used

   .. math::

       CU1(\lambda) = CP(\lambda)

   .. code-block:: python

      circuit = QuantumCircuit(2)
      circuit.cp(lambda, 0, 1)




Circuit symbol:

.. code-block:: text


    q_0: ─■──
          │θ
    q_1: ─■──


Matrix representation:

.. math::

    CU1(\theta) =
        I \otimes |0\rangle\langle 0| + U1 \otimes |1\rangle\langle 1| =
        \begin{pmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 0 & 1 & 0 \\
            0 & 0 & 0 & e^{i\theta}
        \end{pmatrix}

.. seealso::

    :class:`~qiskit.circuit.library.standard_gates.CRZGate`:
    Due to the global phase difference in the matrix definitions
    of U1 and RZ, CU1 and CRZ are different gates with a relative
    phase difference.

### `__init__`

```python
def __init__(self, theta: ParameterValueType, label: str | None=None, ctrl_state: str | int | None=None, *, _base_label=None)
```

Create new CU1 gate.

### `control`

```python
def control(self, num_ctrl_qubits: int=1, label: str | None=None, ctrl_state: str | int | None=None, annotated: bool | None=None)
```

Return a controlled version of the CU1 gate.

The controlled gate is implemented as :class:`.MCU1Gate`, regardless of
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

Return inverted CU1 gate (:math:`CU1(\lambda)^{\dagger} = CU1(-\lambda))`

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.CU1Gate` with inverse parameter
        values.

Returns:
    CU1Gate: inverse gate.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a numpy.array for the CU1 gate.

## `MCU1Gate`

```python
class MCU1Gate(ControlledGate)
```

Multi-controlled-U1 gate.

This is a diagonal and symmetric gate that induces a
phase on the state of the target qubit, depending on the state of the control qubits.

.. warning::

   This gate is deprecated. Instead, the following replacements should be used

   .. math::

       MCU1(\lambda) = MCP(\lambda)

   .. code-block:: python

      circuit = QuantumCircuit(5)
      circuit.mcp(lambda, list(range(4)), 4)




Circuit symbol:

.. code-block:: text

        q_0: ────■────
                 │
                 .
                 │
    q_(n-1): ────■────
             ┌───┴───┐
        q_n: ┤ U1(λ) ├
             └───────┘

.. seealso::

    :class:`~qiskit.circuit.library.standard_gates.CU1Gate`:
    The singly-controlled-version of this gate.

### `__init__`

```python
def __init__(self, lam: ParameterValueType, num_ctrl_qubits: int, label: str | None=None, ctrl_state: str | int | None=None, *, _base_label=None)
```

Create new MCU1 gate.

### `control`

```python
def control(self, num_ctrl_qubits: int=1, label: str | None=None, ctrl_state: str | int | None=None, annotated: bool | None=None)
```

Return a controlled version of the MCU1 gate.

The controlled gate is implemented as :class:`.MCU1Gate`, regardless of
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

Return inverted MCU1 gate (:math:`MCU1(\lambda)^{\dagger} = MCU1(-\lambda))`

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.MCU1Gate` with inverse
        parameter values.

Returns:
    MCU1Gate: inverse gate.
