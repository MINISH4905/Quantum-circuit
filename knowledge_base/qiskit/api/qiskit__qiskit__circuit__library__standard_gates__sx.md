---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/sx.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/sx.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/sx.py`

Sqrt(X) and C-Sqrt(X) gates.

## `SXGate`

```python
class SXGate(SingletonGate)
```

The single-qubit Sqrt(X) gate (:math:`\sqrt{X}`).

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.sx` method.

Matrix representation:

.. math::

    \sqrt{X} = \frac{1}{2} \begin{pmatrix}
            1 + i & 1 - i \\
            1 - i & 1 + i
        \end{pmatrix}

Circuit symbol:

.. code-block:: text

         ┌────┐
    q_0: ┤ √X ├
         └────┘

.. note::

    A global phase difference exists between the definitions of
    :math:`RX(\pi/2)` and :math:`\sqrt{X}`.

    .. math::

        RX(\pi/2) = \frac{1}{\sqrt{2}} \begin{pmatrix}
                    1 & -i \\
                    -i & 1
                  \end{pmatrix}
                = e^{-i \pi/4} \sqrt{X}

### `__init__`

```python
def __init__(self, label: str | None=None)
```

Args:
    label: An optional label for the gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverse SX gate (i.e. SXdg).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.SXdgGate`.

Returns:
    SXdgGate: inverse of :class:`.SXGate`.

### `control`

```python
def control(self, num_ctrl_qubits: int=1, label: str | None=None, ctrl_state: str | int | None=None, annotated: bool | None=None)
```

Return a controlled version of the SX gate.

For a single control qubit, the controlled gate is implemented as :class:`.CSXGate`,
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

## `SXdgGate`

```python
class SXdgGate(SingletonGate)
```

The inverse single-qubit Sqrt(X) gate.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.sxdg` method.

.. math::

    \sqrt{X}^{\dagger} = \frac{1}{2} \begin{pmatrix}
            1 - i & 1 + i \\
            1 + i & 1 - i
        \end{pmatrix}


.. note::

    A global phase difference exists between the definitions of
    :math:`RX(-\pi/2)` and :math:`\sqrt{X}^{\dagger}`.

    .. math::

        RX(-\pi/2) = \frac{1}{\sqrt{2}} \begin{pmatrix}
                    1 & i \\
                    i & 1
                  \end{pmatrix}
                = e^{-i \pi/4} \sqrt{X}^{\dagger}

### `__init__`

```python
def __init__(self, label: str | None=None)
```

Create new SXdg gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverse SXdg gate (i.e. SX).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.SXGate`.

Returns:
    SXGate: inverse of :class:`.SXdgGate`

## `CSXGate`

```python
class CSXGate(SingletonControlledGate)
```

Controlled-√X gate.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.csx` method.

Circuit symbol:

.. code-block:: text

    q_0: ──■──
         ┌─┴──┐
    q_1: ┤ √X ├
         └────┘

Matrix representation:

.. math::

    C\sqrt{X} \ q_0, q_1 =
    I \otimes |0 \rangle\langle 0| + \sqrt{X} \otimes |1 \rangle\langle 1|  =
        \begin{pmatrix}
            1 & 0 & 0 & 0 \\
            0 & (1 + i) / 2 & 0 & (1 - i) / 2 \\
            0 & 0 & 1 & 0 \\
            0 & (1 - i) / 2 & 0 & (1 + i) / 2
        \end{pmatrix}


.. note::

    In Qiskit's convention, higher qubit indices are more significant
    (little endian convention). In many textbooks, controlled gates are
    presented with the assumption of more significant qubits as control,
    which in our case would be `q_1`. Thus a textbook matrix for this
    gate will be:

    .. code-block:: text

             ┌────┐
        q_0: ┤ √X ├
             └─┬──┘
        q_1: ──■──

    .. math::

        C\sqrt{X}\ q_1, q_0 =
            |0 \rangle\langle 0| \otimes I + |1 \rangle\langle 1| \otimes \sqrt{X} =
            \begin{pmatrix}
                1 & 0 & 0 & 0 \\
                0 & 1 & 0 & 0 \\
                0 & 0 & (1 + i) / 2 & (1 - i) / 2 \\
                0 & 0 & (1 - i) / 2 & (1 + i) / 2
            \end{pmatrix}

### `__init__`

```python
def __init__(self, label: str | None=None, ctrl_state: int | str | None=None, *, _base_label=None)
```

Create new CSX gate.
