---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/arithmetic/adders/draper_qft_adder.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/arithmetic/adders/draper_qft_adder.py
license: Apache-2.0
---

## Module `qiskit/synthesis/arithmetic/adders/draper_qft_adder.py`

Compute the sum of two qubit registers using QFT.

## `adder_qft_d00`

```python
def adder_qft_d00(num_state_qubits: int, kind: str='half', annotated: bool=False) -> QuantumCircuit
```

A circuit that uses QFT to perform in-place addition on two qubit registers.

For registers with :math:`n` qubits, the QFT adder can perform addition modulo
:math:`2^n` (with ``kind="fixed"``) or ordinary addition by adding a carry qubits (with
``kind="half"``). The fixed adder uses :math:`(3n^2 - n)/2` :class:`.CPhaseGate` operators,
with an additional :math:`n` for the half adder.

As an example, a non-fixed_point QFT adder circuit that performs addition on two 2-qubit sized
registers is as follows:

.. parsed-literal::

    a_0: ─────────■──────■────────■──────────────────────────────────
                  │      │        │
    a_1: ─────────┼──────┼────────┼────────■──────■──────────────────
         ┌──────┐ │      │        │P(π/4)  │      │P(π/2) ┌─────────┐
    b_0: ┤0     ├─┼──────┼────────■────────┼──────■───────┤0        ├
         │      │ │      │P(π/2)           │P(π)          │         │
    b_1: ┤1 Qft ├─┼──────■─────────────────■──────────────┤1 qft_dg ├
         │      │ │P(π)                                   │         │
   cout: ┤2     ├─■───────────────────────────────────────┤2        ├
         └──────┘                                         └─────────┘

Args:
    num_state_qubits: The number of qubits in either input register for
        state :math:`|a\rangle` or :math:`|b\rangle`. The two input
        registers must have the same number of qubits.
    kind: The kind of adder, can be ``"half"`` for a half adder or
        ``"fixed"`` for a fixed-sized adder. A half adder contains a carry-out to represent
        the most-significant bit, but the fixed-sized adder doesn't and hence performs
        addition modulo ``2 ** num_state_qubits``.
    annotated: If ``True``, creates appropriate control and inverse operations as
        ``AnnotatedOperation`` objects.

References:

[1] T. G. Draper, Addition on a Quantum Computer, 2000.
`arXiv:quant-ph/0008033 <https://arxiv.org/pdf/quant-ph/0008033.pdf>`_

[2] Ruiz-Perez et al., Quantum arithmetic with the Quantum Fourier Transform, 2017.
`arXiv:1411.5949 <https://arxiv.org/pdf/1411.5949.pdf>`_

[3] Vedral et al., Quantum Networks for Elementary Arithmetic Operations, 1995.
`arXiv:quant-ph/9511018 <https://arxiv.org/pdf/quant-ph/9511018.pdf>`_
