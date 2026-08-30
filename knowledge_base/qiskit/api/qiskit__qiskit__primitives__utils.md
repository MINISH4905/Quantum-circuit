---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/utils.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/utils.py
license: Apache-2.0
---

## Module `qiskit/primitives/utils.py`

Utility functions for primitives

## `bound_circuit_to_instruction`

```python
def bound_circuit_to_instruction(circuit: QuantumCircuit) -> Instruction
```

Build an :class:`~qiskit.circuit.Instruction` object from
a :class:`~qiskit.circuit.QuantumCircuit`

This is a specialized version of :func:`~qiskit.converters.circuit_to_instruction`
to avoid deep copy. This requires a quantum circuit whose parameters are all bound.
Because this does not take a copy of the input circuit, this assumes that the input
circuit won't be modified.

If https://github.com/Qiskit/qiskit-terra/issues/7983 is resolved,
we can remove this function.

Args:
    circuit(QuantumCircuit): Input quantum circuit

Returns:
    An :class:`~qiskit.circuit.Instruction` object
