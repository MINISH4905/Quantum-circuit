---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/arithmetic/weighted_sum.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/arithmetic/weighted_sum.py
license: Apache-2.0
---

## Module `qiskit/synthesis/arithmetic/weighted_sum.py`

Implement an integer-weighted sum over a set of qubits.

## `synth_weighted_sum_carry`

```python
def synth_weighted_sum_carry(weighted_sum: WeightedSumGate) -> QuantumCircuit
```

Synthesize a weighted sum gate, by the number of state qubits and the qubit weights.

This method is described in Appendix A of [1].

Reference:

    [1] Stamatopoulos et al. Option Pricing using Quantum Computers (2020)
        `Quantum 4, 291 <https://doi.org/10.22331/q-2020-07-06-291>`__
