---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/t.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/t.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/t.py`

T and Tdg gate.

## `TGate`

```python
class TGate(SingletonGate)
```

Single qubit T gate (:math:`\sqrt[4]{Z}`).

It induces a :math:`\pi/4` phase, and is sometimes called the :math:`\pi/8` gate, because
it is equivalent to :math:`\exp(i\pi/8~Z)` up to a global phase.

This is a non-Clifford gate and a fourth-root of Pauli-Z.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.t` method.

Matrix representation:

.. math::

    T = \begin{pmatrix}
            1 & 0 \\
            0 & e^{i\pi/4}
        \end{pmatrix}

Circuit symbol:

.. code-block:: text

         ┌───┐
    q_0: ┤ T ├
         └───┘

Equivalent to a :math:`\pi/4` radian rotation about the Z axis.

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

Return inverse T gate (i.e. Tdg).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.TdgGate`.

Returns:
    TdgGate: inverse of :class:`.TGate`

## `TdgGate`

```python
class TdgGate(SingletonGate)
```

Single qubit T-adjoint gate (:math:`T^\dagger`).

It induces a :math:`-\pi/4` phase.

This is a non-Clifford gate and a fourth-root of Pauli-Z.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.tdg` method.

Matrix representation:

.. math::

    T^\dagger = \begin{pmatrix}
            1 & 0 \\
            0 & e^{-i\pi/4}
        \end{pmatrix}

Circuit symbol:

.. code-block:: text

         ┌─────┐
    q_0: ┤ Tdg ├
         └─────┘

Equivalent to a :math:`-\pi/4` radian rotation about the Z axis.

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

Return inverse Tdg gate (i.e. T).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.TGate`.

Returns:
    TGate: inverse of :class:`.TdgGate`
