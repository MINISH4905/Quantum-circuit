---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/swap.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/swap.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/swap.py`

Swap gate.

## `SwapGate`

```python
class SwapGate(SingletonGate)
```

The SWAP gate.

This is a symmetric and Clifford gate.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.swap` method.

Circuit symbol:

.. code-block:: text

    q_0: ─X─
          │
    q_1: ─X─

Matrix representation:

.. math::

    SWAP =
        \begin{pmatrix}
            1 & 0 & 0 & 0 \\
            0 & 0 & 1 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 0 & 0 & 1
        \end{pmatrix}

The gate is equivalent to a state swap and is a classical logic gate.

.. math::

    |a, b\rangle \rightarrow |b, a\rangle

### `__init__`

```python
def __init__(self, label: str | None=None)
```

Args:
    label: An optional label for the gate.

### `control`

```python
def control(self, num_ctrl_qubits: int=1, label: str | None=None, ctrl_state: str | int | None=None, annotated: bool | None=None)
```

Return a controlled version of the Swap gate.

For a single control qubit, the controlled gate is implemented as :class:`.CSwapGate`
(also known as Fredkin gate), regardless of the value of `annotated`.

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
        or as an annotated operation. If ``None``, defaults to ``False``.

Returns:
    A controlled version of this gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverse Swap gate (itself).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as this gate
        is self-inverse.

Returns:
    SwapGate: inverse gate (self-inverse).

## `CSwapGate`

```python
class CSwapGate(SingletonControlledGate)
```

Controlled-SWAP gate, also known as the Fredkin gate.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.cswap` and
:meth:`~qiskit.circuit.QuantumCircuit.fredkin` methods.

Circuit symbol:

.. code-block:: text

    q_0: ─■─
          │
    q_1: ─X─
          │
    q_2: ─X─


Matrix representation:

.. math::

    CSWAP\ q_0, q_1, q_2 =
        I \otimes I \otimes |0 \rangle \langle 0| +
        SWAP \otimes |1 \rangle \langle 1| =
        \begin{pmatrix}
            1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\
            0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 \\
            0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 \\
            0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 \\
            0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 \\
            0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 \\
            0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 \\
        \end{pmatrix}

.. note::

    In Qiskit's convention, higher qubit indices are more significant
    (little endian convention). In many textbooks, controlled gates are
    presented with the assumption of more significant qubits as control,
    which in our case would be q_2. Thus a textbook matrix for this
    gate will be:

    .. code-block:: text

        q_0: ─X─
              │
        q_1: ─X─
              │
        q_2: ─■─

    .. math::

        CSWAP\ q_2, q_1, q_0 =
            |0 \rangle \langle 0| \otimes I \otimes I +
            |1 \rangle \langle 1| \otimes SWAP =
            \begin{pmatrix}
                1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
                0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\
                0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 \\
                0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 \\
                0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 \\
                0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 \\
                0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 \\
                0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 \\
            \end{pmatrix}

In the computational basis, this gate swaps the states of
the two target qubits if the control qubit is in the
:math:`|1\rangle` state.

.. math::
    |0, b, c\rangle \rightarrow |0, b, c\rangle
    |1, b, c\rangle \rightarrow |1, c, b\rangle

### `__init__`

```python
def __init__(self, label: str | None=None, ctrl_state: int | str | None=None, *, _base_label=None)
```

Create new CSWAP gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverse CSwap gate (itself).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as this gate
        is self-inverse.

Returns:
    CSwapGate: inverse gate (self-inverse).
