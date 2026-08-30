---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/s.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/s.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/s.py`

The S, Sdg, CS and CSdg gates.

## `SGate`

```python
class SGate(SingletonGate)
```

Single qubit S gate (:math:`\sqrt{Z}`).

It induces a :math:`\pi/2` phase, and is sometimes called the P gate (phase).

This is a Clifford gate and a square-root of Pauli-Z.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.s` method.

Matrix representation:

.. math::

    S = \begin{pmatrix}
            1 & 0 \\
            0 & i
        \end{pmatrix}

Circuit symbol:

.. code-block:: text

         ┌───┐
    q_0: ┤ S ├
         └───┘

Equivalent to a :math:`\pi/2` radian rotation about the Z axis.

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

Return a controlled version of the S gate.

For a single control qubit, the controlled gate is implemented as :class:`.CSGate`,
regardless of the value of ``annotated``.

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

Return inverse of S (:class:`.SdgGate`).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.SdgGate`.

Returns:
    SdgGate: inverse of :class:`.SGate`

## `SdgGate`

```python
class SdgGate(SingletonGate)
```

Single qubit S-adjoint gate (:math:`S^\dagger`).

It induces a :math:`-\pi/2` phase.

This is a Clifford gate and a square-root of Pauli-Z.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.sdg` method.

Matrix representation:

.. math::

    Sdg = \begin{pmatrix}
            1 & 0 \\
            0 & -i
        \end{pmatrix}

Circuit symbol:

.. code-block:: text

         ┌─────┐
    q_0: ┤ Sdg ├
         └─────┘

Equivalent to a :math:`-\pi/2` radian rotation about the Z axis.

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

Return a controlled version of the Sdg gate.

For a single control qubit, the controlled gate is implemented as :class:`.CSdgGate`,
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

Return inverse of Sdg (SGate).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.SGate`.

Returns:
    SGate: inverse of :class:`.SdgGate`

## `CSGate`

```python
class CSGate(SingletonControlledGate)
```

Controlled-S gate.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.cs` method.

Circuit symbol:

.. code-block:: text

    q_0: ──■──
         ┌─┴─┐
    q_1: ┤ S ├
         └───┘

Matrix representation:

.. math::

    CS \ q_0, q_1 =
    I \otimes |0 \rangle\langle 0| + S \otimes |1 \rangle\langle 1|  =
        \begin{pmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 0 & 1 & 0 \\
            0 & 0 & 0 & i
        \end{pmatrix}

### `__init__`

```python
def __init__(self, label: str | None=None, ctrl_state: int | str | None=None, *, _base_label=None)
```

Create new CS gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverse of CSGate (CSdgGate).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.CSdgGate`.

Returns:
    CSdgGate: inverse of :class:`.CSGate`

## `CSdgGate`

```python
class CSdgGate(SingletonControlledGate)
```

Controlled-:math:`S^\dagger` gate.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.csdg` method.

Circuit symbol:

.. code-block:: text

    q_0: ───■───
         ┌──┴──┐
    q_1: ┤ Sdg ├
         └─────┘

Matrix representation:

.. math::

    CS^\dagger \ q_0, q_1 =
    I \otimes |0 \rangle\langle 0| + S^\dagger \otimes |1 \rangle\langle 1|  =
        \begin{pmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 0 & 1 & 0 \\
            0 & 0 & 0 & -i
        \end{pmatrix}

### `__init__`

```python
def __init__(self, label: str | None=None, ctrl_state: int | str | None=None, *, _base_label=None)
```

Create new CSdg gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverse of CSdgGate (CSGate).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.CSGate`.

Returns:
    CSGate: inverse of :class:`.CSdgGate`
