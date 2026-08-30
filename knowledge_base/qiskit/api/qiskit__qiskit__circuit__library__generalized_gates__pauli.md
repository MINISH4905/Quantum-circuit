---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/generalized_gates/pauli.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/generalized_gates/pauli.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/generalized_gates/pauli.py`

Simulator command to perform multiple pauli gates in a single pass

## `PauliGate`

```python
class PauliGate(Gate)
```

A multi-qubit Pauli gate.

This gate exists for optimization purposes for the
quantum statevector simulation, since applying multiple
pauli gates to different qubits at once can be done via
a single pass on the statevector.

The functionality is equivalent to applying
the pauli gates sequentially using standard Qiskit gates.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.pauli` method.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverted pauli gate (itself).

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a Numpy.array for the pauli gate.
i.e. tensor product of the paulis
