---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/adders/draper_qft_adder.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/adders/draper_qft_adder.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/adders/draper_qft_adder.py`

Compute the sum of two qubit registers using QFT.

## `DraperQFTAdder`

```python
class DraperQFTAdder(Adder)
```

A circuit that uses QFT to perform in-place addition on two qubit registers.

For registers with :math:`n` qubits, the QFT adder can perform addition modulo
:math:`2^n` (with ``kind="fixed"``) or ordinary addition by adding a carry qubit (with
``kind="half"``).

As an example, a QFT adder circuit that performs an ordinary addition on two 2-qubit
sized registers is as follows:

.. code-block:: text

     a_0: ─────────■──────■────────────────────────■────────────────
                   │      │                        │
     a_1: ─────────┼──────┼────────■──────■────────┼────────────────
          ┌──────┐ │P(π)  │        │      │        │       ┌───────┐
     b_0: ┤0     ├─■──────┼────────┼──────┼────────┼───────┤0      ├
          │      │        │P(π/2)  │P(π)  │        │       │       │
     b_1: ┤1 QFT ├────────■────────■──────┼────────┼───────┤1 IQFT ├
          │      │                        │P(π/2)  │P(π/4) │       │
    cout: ┤2     ├────────────────────────■────────■───────┤2      ├
          └──────┘                                         └───────┘

.. note::

    The QFT and inverse-QFT blocks in this implementation omit their swap networks,
    which reverses the qubit order for a more efficient implementation. This affects
    which qubits the controlled-phase gates act on. This drawing represents how the
    adder is implemented in Qiskit; it should not be used as instructions for building
    the circuit manually.

.. seealso::

    The following generic gate objects perform additions, like this circuit class,
    but allow the compiler to select the optimal decomposition based on the context.
    Specific implementations can be set via the :class:`.HLSConfig`, e.g. this
    circuit can be chosen via ``Adder=["qft_d00"]``.

    :class:`.ModularAdderGate`: A generic inplace adder, modulo :math:`2^n`. This
        is functionally equivalent to ``kind="fixed"``.

    :class:`.AdderGate`: A generic inplace adder. This
        is functionally equivalent to ``kind="half"``.

References:

[1] T. G. Draper, Addition on a Quantum Computer, 2000.
`arXiv:quant-ph/0008033 <https://arxiv.org/pdf/quant-ph/0008033.pdf>`_

[2] Ruiz-Perez et al., Quantum arithmetic with the Quantum Fourier Transform, 2017.
`arXiv:1411.5949 <https://arxiv.org/pdf/1411.5949.pdf>`_

[3] Vedral et al., Quantum Networks for Elementary Arithmetic Operations, 1995.
`arXiv:quant-ph/9511018 <https://arxiv.org/pdf/quant-ph/9511018.pdf>`_

### `__init__`

```python
def __init__(self, num_state_qubits: int, kind: str='fixed', name: str='DraperQFTAdder') -> None
```

Args:
    num_state_qubits: The number of qubits in either input register for
        state :math:`|a\rangle` or :math:`|b\rangle`. The two input
        registers must have the same number of qubits.
    kind: The kind of adder, can be ``'half'`` for a half adder or
        ``'fixed'`` for a fixed-sized adder. A half adder contains a carry-out to represent
        the most-significant bit, but the fixed-sized adder doesn't and hence performs
        addition modulo ``2 ** num_state_qubits``.
    name: The name of the circuit object.
Raises:
    ValueError: If ``num_state_qubits`` is lower than 1.
