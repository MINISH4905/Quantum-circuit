---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/multi_controlled/gray_code.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/multi_controlled/gray_code.py
license: Apache-2.0
---

## `generate_gray_code`

```python
def generate_gray_code(num_bits)
```

Generate the gray code for ``num_bits`` bits.

## `gray_code_chain`

```python
def gray_code_chain(q, num_ctrl_qubits, gate)
```

Apply the gate to the last qubit in the register ``q``, controlled on all
preceding qubits. This function uses the gray code to propagate down to the last qubit.

Ported and adapted from Aqua (github.com/Qiskit/qiskit-aqua),
commit 769ca8d, file qiskit/aqua/circuits/gates/multi_control_u1_gate.py.
