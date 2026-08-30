---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/arithmetic/multipliers/hrs_cumulative_multiplier.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/arithmetic/multipliers/hrs_cumulative_multiplier.py
license: Apache-2.0
---

## Module `qiskit/synthesis/arithmetic/multipliers/hrs_cumulative_multiplier.py`

Compute the product of two qubit registers using classical multiplication approach.

## `multiplier_cumulative_h18`

```python
def multiplier_cumulative_h18(num_state_qubits: int, num_result_qubits: int | None=None) -> QuantumCircuit
```

A multiplication circuit to store product of two input registers out-of-place.

The circuit uses the approach from Ref. [1]. As an example, a multiplier circuit that
performs a non-modular multiplication on two 3-qubit sized registers is:

.. plot::
    :alt: Circuit diagram output by the previous code.
    :include-source:

    from qiskit.synthesis.arithmetic import multiplier_cumulative_h18

    num_state_qubits = 3
    circuit = multiplier_cumulative_h18(num_state_qubits)
    circuit.draw("mpl")

Multiplication in this circuit is implemented in a classical approach by performing
a series of shifted additions using one of the input registers while the qubits
from the other input register act as control qubits for the adders.

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

[1] Häner et al., Optimizing Quantum Circuits for Arithmetic, 2018.
`arXiv:1805.12445 <https://arxiv.org/pdf/1805.12445.pdf>`_
