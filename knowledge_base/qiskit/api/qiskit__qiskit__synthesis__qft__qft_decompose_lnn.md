---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/qft/qft_decompose_lnn.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/qft/qft_decompose_lnn.py
license: Apache-2.0
---

## Module `qiskit/synthesis/qft/qft_decompose_lnn.py`

Circuit synthesis for a QFT circuit.

## `synth_qft_line`

```python
def synth_qft_line(num_qubits: int, do_swaps: bool=True, approximation_degree: int=0) -> QuantumCircuit
```

Construct a circuit for the Quantum Fourier Transform using linear
neighbor connectivity.

The construction is based on Fig 2.b in Fowler et al. [1].

.. note::

    With the default value of ``do_swaps = True``, this synthesis algorithm creates a
    circuit that faithfully implements the QFT operation. When ``do_swaps = False``,
    this synthesis algorithm creates a circuit that corresponds to "QFT-with-reversal":
    applying the QFT and reversing the order of its output qubits.

Args:
    num_qubits: The number of qubits on which the Quantum Fourier Transform acts.
    approximation_degree: The degree of approximation (0 for no approximation).
        It is possible to implement the QFT approximately by ignoring
        controlled-phase rotations with the angle beneath a threshold. This is discussed
        in more detail in https://arxiv.org/abs/quant-ph/9601018 or
        https://arxiv.org/abs/quant-ph/0403071.
    do_swaps: Whether to synthesize the "QFT" or the "QFT-with-reversal" operation.

Returns:
    A circuit implementing the QFT operation.

References:
    1. A. G. Fowler, S. J. Devitt, and L. C. L. Hollenberg,
       *Implementation of Shor's algorithm on a linear nearest neighbour qubit array*,
       Quantum Info. Comput. 4, 4 (July 2004), 237–251.
       `arXiv:quant-ph/0402196 [quant-ph] <https://arxiv.org/abs/quant-ph/0402196>`_
