---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/arithmetic/multipliers/rg_qft_multiplier.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/arithmetic/multipliers/rg_qft_multiplier.py
license: Apache-2.0
---

## Module `qiskit/synthesis/arithmetic/multipliers/rg_qft_multiplier.py`

Compute the product of two qubit registers using QFT.

## `multiplier_qft_r17`

```python
def multiplier_qft_r17(num_state_qubits: int, num_result_qubits: int | None=None) -> QuantumCircuit
```

A QFT multiplication circuit to store product of two input registers out-of-place.

Multiplication in this circuit is implemented using the procedure of Fig. 3 in [1], where
weighted sum rotations are implemented as given in Fig. 5 in [1]. QFT is used on the output
register and is followed by rotations controlled by input registers. The rotations
transform the state into the product of two input registers in QFT base, which is
reverted from QFT base using inverse QFT.
For example, on 3 state qubits, a full multiplier is given by:

.. plot::
    :alt: Circuit diagram output by the previous code.
    :include-source:

    from qiskit.synthesis.arithmetic import multiplier_qft_r17

    num_state_qubits = 3
    circuit = multiplier_qft_r17(num_state_qubits)
    circuit.draw("mpl")

Args:
    num_state_qubits: The number of qubits in either input register for
        state :math:`|a\rangle` or :math:`|b\rangle`. The two input
        registers must have the same number of qubits.
    num_result_qubits: The number of result qubits to limit the output to.
        If number of result qubits is :math:`n`, multiplication modulo :math:`2^n` is performed
        to limit the output to the specified number of qubits. Default
        value is ``2 * num_state_qubits`` to represent any possible
        result from the multiplication of the two inputs.

Raises:
    ValueError: If ``num_result_qubits`` is given and not valid, meaning not
        in ``[num_state_qubits, 2 * num_state_qubits]``.

References:

[1] Ruiz-Perez et al., Quantum arithmetic with the Quantum Fourier Transform, 2017.
`arXiv:1411.5949 <https://arxiv.org/pdf/1411.5949.pdf>`_
