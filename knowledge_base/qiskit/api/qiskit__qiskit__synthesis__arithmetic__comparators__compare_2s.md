---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/arithmetic/comparators/compare_2s.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/arithmetic/comparators/compare_2s.py
license: Apache-2.0
---

## Module `qiskit/synthesis/arithmetic/comparators/compare_2s.py`

Integer comparator based on 2s complement.

## `synth_integer_comparator_2s`

```python
def synth_integer_comparator_2s(num_state_qubits: int, value: int, geq: bool=True) -> QuantumCircuit
```

Implement an integer comparison based on 2s complement.

This is based on Appendix B of [1].

Args:
    num_state_qubits: The number of qubits encoding the value to compare to.
    value: The value to compare to.
    geq: If ``True`` flip the target bit if the qubit state is :math:`\geq` than the value,
        otherwise implement :math:`<`.

Returns:
    A circuit implementing the integer comparator.

References:

    [1] J. Gacon et al. "Quantum-enhanced simulation-based optimization"
        `arXiv:2005.10780 <https://arxiv.org/abs/2005.10780>`__.
