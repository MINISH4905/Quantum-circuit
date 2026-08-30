---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/dcx.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/dcx.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/dcx.py`

Double-CNOT gate.

## `DCXGate`

```python
class DCXGate(SingletonGate)
```

Double-CX gate.

A 2-qubit Clifford gate consisting of two back-to-back
CX gates with alternate controls.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.dcx` method.

.. code-block:: text

              ┌───┐
    q_0: ──■──┤ X ├
         ┌─┴─┐└─┬─┘
    q_1: ┤ X ├──■──
         └───┘

This is a classical logic gate, equivalent to a CNOT-SWAP (CNS) sequence,
and locally equivalent to an iSWAP.

.. math::

    DCX\ q_0, q_1 =
        \begin{pmatrix}
            1 & 0 & 0 & 0 \\
            0 & 0 & 0 & 1 \\
            0 & 1 & 0 & 0 \\
            0 & 0 & 1 & 0
        \end{pmatrix}

### `__init__`

```python
def __init__(self, label: str | None=None) -> None
```

Args:
    label: An optional label for the gate.
