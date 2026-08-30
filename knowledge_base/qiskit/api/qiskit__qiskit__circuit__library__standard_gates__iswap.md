---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/iswap.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/iswap.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/iswap.py`

iSWAP gate.

## `iSwapGate`

```python
class iSwapGate(SingletonGate)
```

iSWAP gate.

A 2-qubit XX+YY interaction.
This is a Clifford and symmetric gate. Its action is to swap two qubit
states and phase the :math:`|01\rangle` and :math:`|10\rangle`
amplitudes by i.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.iswap` method.

Circuit symbol:

.. code-block:: text

    q_0: ─⨂─
          │
    q_1: ─⨂─

Reference implementation:

.. code-block:: text

         ┌───┐┌───┐     ┌───┐
    q_0: ┤ S ├┤ H ├──■──┤ X ├─────
         ├───┤└───┘┌─┴─┐└─┬─┘┌───┐
    q_1: ┤ S ├─────┤ X ├──■──┤ H ├
         └───┘     └───┘     └───┘

Matrix representation:

.. math::

    iSWAP = R_{XX+YY}\left(-\frac{\pi}{2}\right)
      = \exp\left(i \frac{\pi}{4} \left(X{\otimes}X+Y{\otimes}Y\right)\right) =
        \begin{pmatrix}
            1 & 0 & 0 & 0 \\
            0 & 0 & i & 0 \\
            0 & i & 0 & 0 \\
            0 & 0 & 0 & 1
        \end{pmatrix}

This gate is equivalent to a SWAP up to a diagonal.

.. math::

     iSWAP =
        \begin{pmatrix}
            1 & 0 & 0 & 0 \\
            0 & 0 & 1 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 0 & 0 & 1
        \end{pmatrix}
     .  \begin{pmatrix}
            1 & 0 & 0 & 0 \\
            0 & i & 0 & 0 \\
            0 & 0 & i & 0 \\
            0 & 0 & 0 & 1
        \end{pmatrix}

### `__init__`

```python
def __init__(self, label: str | None=None)
```

Args:
    label: An optional label for the gate.
