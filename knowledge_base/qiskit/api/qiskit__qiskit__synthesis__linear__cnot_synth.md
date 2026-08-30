---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/linear/cnot_synth.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/linear/cnot_synth.py
license: Apache-2.0
---

## Module `qiskit/synthesis/linear/cnot_synth.py`

Implementation of the GraySynth algorithm for synthesizing CNOT-Phase
circuits with efficient CNOT cost, and the Patel-Hayes-Markov algorithm
for optimal synthesis of linear (CNOT-only) reversible circuits.

## `synth_cnot_count_full_pmh`

```python
def synth_cnot_count_full_pmh(state: list[list[bool]] | np.ndarray[bool], section_size: int | None=None) -> QuantumCircuit
```

Synthesize linear reversible circuits for all-to-all architecture
using Patel, Markov and Hayes method.

This function is an implementation of the Patel, Markov and Hayes algorithm from [1]
for optimal synthesis of linear reversible circuits for all-to-all architecture,
as specified by an :math:`n \times n` matrix.

Args:
    state: :math:`n \times n` boolean invertible matrix, describing
        the state of the input circuit.
    section_size: The size of each section in the Patel–Markov–Hayes algorithm [1].
        If ``None`` it is chosen to be :math:`\max(2, \alpha\log_2(n))` with
        :math:`\alpha = 0.56`, which approximately minimizes the upper bound on the number
        of row operations given in [1] Eq. (3).

Returns:
    A CX-only circuit implementing the linear transformation.

Raises:
    ValueError: When ``section_size`` is larger than the number of columns.

References:
    1. Patel, Ketan N., Igor L. Markov, and John P. Hayes,
       *Optimal synthesis of linear reversible circuits*,
       Quantum Information & Computation 8.3 (2008): 282-294.
       `arXiv:quant-ph/0302002 [quant-ph] <https://arxiv.org/abs/quant-ph/0302002>`_
