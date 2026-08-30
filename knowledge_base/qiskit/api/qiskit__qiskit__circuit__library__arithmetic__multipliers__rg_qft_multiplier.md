---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/multipliers/rg_qft_multiplier.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/multipliers/rg_qft_multiplier.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/multipliers/rg_qft_multiplier.py`

Compute the product of two qubit registers using QFT.

## `RGQFTMultiplier`

```python
class RGQFTMultiplier(Multiplier)
```

A QFT multiplication circuit to store product of two input registers out-of-place.

Multiplication in this circuit is implemented using the procedure of Fig. 3 in [1], where
weighted sum rotations are implemented as given in Fig. 5 in [1]. The QFT is used on the
output register and is followed by rotations controlled by input registers. The rotations
transform the state into the product of two input registers in the QFT basis, which is
reverted from the QFT basis using the inverse QFT.

As an example, a circuit that performs a modular QFT multiplication on two 2-qubit
sized input registers with an output register of 2 qubits, is as follows:

.. code-block:: text

      a_0: ────────────────────────────────────────■───────■──────■──────■────────────────
                                                   │       │      │      │
      a_1: ─────────■───────■───────■───────■──────┼───────┼──────┼──────┼────────────────
                    │       │       │       │      │       │      │      │
      b_0: ─────────┼───────┼───────■───────■──────┼───────┼──────■──────■────────────────
                    │       │       │       │      │       │      │      │
      b_1: ─────────■───────■───────┼───────┼──────■───────■──────┼──────┼────────────────
           ┌──────┐ │P(4π)  │       │P(2π)  │      │P(2π)  │      │P(π)  │       ┌───────┐
    out_0: ┤0     ├─■───────┼───────■───────┼──────■───────┼──────■──────┼───────┤0      ├
           │  qft │         │P(2π)          │P(π)          │P(π)         │P(π/2) │  iqft │
    out_1: ┤1     ├─────────■───────────────■──────────────■─────────────■───────┤1      ├
           └──────┘                                                              └───────┘

.. seealso::

    The :class:`.MultiplierGate` object represents a multiplication, like this circuit class,
    but allows the compiler to select the optimal decomposition based on the context.
    Specific implementations can be set via the :class:`.HLSConfig`, e.g. this circuit
    can be chosen via ``Multiplier=["qft_r17"]``.

References:

[1] Ruiz-Perez et al., Quantum arithmetic with the Quantum Fourier Transform, 2017.
`arXiv:1411.5949 <https://arxiv.org/pdf/1411.5949.pdf>`_

### `__init__`

```python
def __init__(self, num_state_qubits: int, num_result_qubits: int | None=None, name: str='RGQFTMultiplier') -> None
```

Args:
    num_state_qubits: The number of qubits in either input register for
        state :math:`|a\rangle` or :math:`|b\rangle`. The two input
        registers must have the same number of qubits.
    num_result_qubits: The number of result qubits to limit the output to.
        If number of result qubits is :math:`n`, multiplication modulo :math:`2^n` is performed
        to limit the output to the specified number of qubits. Default
        value is ``2 * num_state_qubits`` to represent any possible
        result from the multiplication of the two inputs.
    name: The name of the circuit object.
