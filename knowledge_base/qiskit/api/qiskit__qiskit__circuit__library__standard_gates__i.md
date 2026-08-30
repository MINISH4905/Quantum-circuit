---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/i.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/i.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/i.py`

Identity gate.

## `IGate`

```python
class IGate(SingletonGate)
```

Identity gate.

This typically represents a single-qubit idle cycle.
For device-specific information, refer to the device's :class:`.Target`.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.i` and
:meth:`~qiskit.circuit.QuantumCircuit.id` methods.

Matrix representation:

.. math::

    I = \begin{pmatrix}
            1 & 0 \\
            0 & 1
        \end{pmatrix}

Circuit symbol:

.. code-block:: text

         ┌───┐
    q_0: ┤ I ├
         └───┘

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

Returns the inverse gate (itself).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as this gate
        is self-inverse.

Returns:
    IGate: inverse gate (self-inverse).
.
