---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/barrier.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/barrier.py
license: Apache-2.0
---

## Module `qiskit/circuit/barrier.py`

Barrier instruction.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.barrier` method.

## `Barrier`

```python
class Barrier(Instruction)
```

A directive for circuit compilation to separate pieces of a circuit so that any optimizations
or re-writes are constrained to only act between barriers.

This will also appear in visualizations as a visual marker.

### `__init__`

```python
def __init__(self, num_qubits: int, label: str | None=None)
```

Args:
    num_qubits: the number of qubits for the barrier.
    label: the optional label of this barrier.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Special case. Return self.
