---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/qft/qft_decompose_full.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/qft/qft_decompose_full.py
license: Apache-2.0
---

## Module `qiskit/synthesis/qft/qft_decompose_full.py`

Circuit synthesis for a QFT circuit.

## `synth_qft_full`

```python
def synth_qft_full(num_qubits: int, do_swaps: bool=True, approximation_degree: int=0, insert_barriers: bool=False, inverse: bool=False, name: str | None=None) -> QuantumCircuit
```

Construct a circuit for the Quantum Fourier Transform using all-to-all connectivity.

.. note::

    With the default value of ``do_swaps = True``, this synthesis algorithm creates a
    circuit that faithfully implements the QFT operation. This circuit contains a sequence
    of swap gates at the end, corresponding to reversing the order of its output qubits.
    In some applications this reversal permutation can be avoided. Setting ``do_swaps = False``
    creates a circuit without this reversal permutation, at the expense that this circuit
    implements the "QFT-with-reversal" instead of QFT. Alternatively, the
    :class:`~.ElidePermutations` transpiler pass is able to remove these swap gates.

Args:
    num_qubits: The number of qubits on which the Quantum Fourier Transform acts.
    do_swaps: Whether to synthesize the "QFT" or the "QFT-with-reversal" operation.
    approximation_degree: The degree of approximation (0 for no approximation).
        It is possible to implement the QFT approximately by ignoring
        controlled-phase rotations with the angle beneath a threshold. This is discussed
        in more detail in https://arxiv.org/abs/quant-ph/9601018 or
        https://arxiv.org/abs/quant-ph/0403071.
    insert_barriers: If ``True``, barriers are inserted for improved visualization.
    inverse: If ``True``, the inverse Quantum Fourier Transform is constructed.
    name: The name of the circuit.

Returns:
    A circuit implementing the QFT operation.
