---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/arithmetic/adders/vrg_modular_adder.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/arithmetic/adders/vrg_modular_adder.py
license: Apache-2.0
---

## Module `qiskit/synthesis/arithmetic/adders/vrg_modular_adder.py`

Compute modular sum of two qubit registers without any ancillary qubits.

## `adder_modular_v17`

```python
def adder_modular_v17(num_qubits: int) -> QuantumCircuit
```

Construct a modular adder circuit with no ancillary qubits based on the Van Rentergem-style
adder in Fig. 15 of [1]. The implementation uses at most :math:`16k - 13` CX gates for an
adder with `k` qubits in each register, where `k = num_qubits`.

Args:
    num_qubits: The size of the register.

Returns:
    The quantum circuit implementing the modular adder.

Raises:
    ValueError: If ``num_qubits`` is less than 1.

References:

[1] Gidney, Factoring with n+2 clean qubits and n-1 dirty qubits, 2017.
`arxiv:1706.07884 <https://arxiv.org/abs/1706.07884>`_
