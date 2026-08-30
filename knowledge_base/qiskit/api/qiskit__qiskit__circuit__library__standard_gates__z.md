---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/z.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/z.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/z.py`

Z, CZ and CCZ gates.

## `ZGate`

```python
class ZGate(SingletonGate)
```

The single-qubit Pauli-Z gate (:math:`\sigma_z`).

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.z` method.

Matrix representation:

.. math::

    Z = \begin{pmatrix}
            1 & 0 \\
            0 & -1
        \end{pmatrix}

Circuit symbol:

.. code-block:: text

         ┌───┐
    q_0: ┤ Z ├
         └───┘

Equivalent to a :math:`\pi` radian rotation about the Z axis.

.. note::

    A global phase difference exists between the definitions of
    :math:`RZ(\pi)` and :math:`Z`.

    .. math::

        RZ(\pi) = \begin{pmatrix}
                    -i & 0 \\
                    0 & i
                  \end{pmatrix}
                = -i Z

The gate is equivalent to a phase flip.

.. math::

    |0\rangle \rightarrow |0\rangle \\
    |1\rangle \rightarrow -|1\rangle

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

Return a controlled version of the Z gate.

For a single control qubit, the controlled gate is implemented as a
:class:`.CZGate`. For two control qubits, the controlled gate is implemented
as a :class:`.CCZGate`. In these cases, the value of ``annotated`` is ignored.

For three or more control qubits, the controlled gate is implemented
as either :class:`.ControlledGate` when ``annotated`` is ``False``, and
as :class:`.AnnotatedOperation` when ``annotated`` is ``True``.

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

Return inverted Z gate (itself).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as this gate
        is self-inverse.

Returns:
    ZGate: inverse gate (self-inverse).

## `CZGate`

```python
class CZGate(SingletonControlledGate)
```

Controlled-Z gate.

This is a Clifford and symmetric gate.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.cz` method.

Circuit symbol:

.. code-block:: text

    q_0: ─■─
          │
    q_1: ─■─

Matrix representation:

.. math::

    CZ\ q_0, q_1 =
        I \otimes |0\rangle\langle 0| + Z \otimes |1\rangle\langle 1| =
        \begin{pmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 0 & 1 & 0 \\
            0 & 0 & 0 & -1
        \end{pmatrix}

In the computational basis, this gate flips the phase of
the target qubit if the control qubit is in the :math:`|1\rangle` state.

### `__init__`

```python
def __init__(self, label: str | None=None, ctrl_state: int | str | None=None, *, _base_label=None)
```

Create new CZ gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverted CZ gate (itself).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as this gate
        is self-inverse.

Returns:
    CZGate: inverse gate (self-inverse).

### `control`

```python
def control(self, num_ctrl_qubits: int=1, label: str | None=None, ctrl_state: int | str | None=None, annotated: bool | None=None)
```

Return a controlled version of the CZ gate.

For a single control qubit, the controlled gate is implemented as a
:class:`.CCZGate`, regardless of the value of ``annotated``.

For two or more control qubits, the controlled gate is implemented
as either :class:`.ControlledGate` when ``annotated`` is ``False``, and
as :class:`.AnnotatedOperation` when ``annotated`` is ``True``.

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

## `CCZGate`

```python
class CCZGate(SingletonControlledGate)
```

CCZ gate.

This is a symmetric gate.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.ccz` method.

Circuit symbol:

.. code-block:: text

    q_0: ─■─
          │
    q_1: ─■─
          │
    q_2: ─■─

Matrix representation:

.. math::

    CCZ\ q_0, q_1, q_2 =
        I \otimes I \otimes |0\rangle\langle 0| + CZ \otimes |1\rangle\langle 1| =
        \begin{pmatrix}
            1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\
            0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 \\
            0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 \\
            0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 \\
            0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 \\
            0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 \\
            0 & 0 & 0 & 0 & 0 & 0 & 0 & -1
        \end{pmatrix}

In the computational basis, this gate flips the phase of
the target qubit if the control qubits are in the :math:`|11\rangle` state.

### `__init__`

```python
def __init__(self, label: str | None=None, ctrl_state: int | str | None=None, *, _base_label=None)
```

Create new CCZ gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverted CCZ gate (itself).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as this gate
        is self-inverse.

Returns:
    CCZGate: inverse gate (self-inverse).
