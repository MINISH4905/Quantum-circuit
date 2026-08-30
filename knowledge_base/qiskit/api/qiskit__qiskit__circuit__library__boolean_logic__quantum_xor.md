---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/boolean_logic/quantum_xor.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/boolean_logic/quantum_xor.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/boolean_logic/quantum_xor.py`

Bitwise XOR circuit and gate.

## `XOR`

```python
class XOR(QuantumCircuit)
```

An n_qubit circuit for bitwise xor-ing the input with some integer ``amount``.

The ``amount`` is xor-ed in bitstring form with the input.

This circuit can also represent addition by ``amount`` over the finite field GF(2).

### `__init__`

```python
def __init__(self, num_qubits: int, amount: int | None=None, seed: int | None=None) -> None
```

Args:
    num_qubits: the width of circuit.
    amount: the xor amount in decimal form.
    seed: random seed in case a random xor is requested.

Raises:
    CircuitError: if the xor bitstring exceeds available qubits.

Reference Circuit:

.. plot::
    :alt: Diagram illustrating the previously described circuit.

    from qiskit.circuit.library import XOR
    from qiskit.visualization.library import _generate_circuit_library_visualization
    circuit = XOR(5, seed=42)
    _generate_circuit_library_visualization(circuit)

## `BitwiseXorGate`

```python
class BitwiseXorGate(Gate)
```

An n-qubit gate for bitwise xor-ing the input with some integer ``amount``.

The ``amount`` is xor-ed in bitstring form with the input.

This gate can also represent addition by ``amount`` over the finite field GF(2).

Reference Circuit:

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit import QuantumCircuit
   from qiskit.circuit.library import BitwiseXorGate
   from qiskit.visualization.library import _generate_circuit_library_visualization
   circuit = QuantumCircuit(5)
   circuit.append(BitwiseXorGate(5, amount=12), [0, 1, 2, 3, 4])
   _generate_circuit_library_visualization(circuit)

### `__init__`

```python
def __init__(self, num_qubits: int, amount: int) -> None
```

Args:
    num_qubits: the width of circuit.
    amount: the xor amount in decimal form.

Raises:
    CircuitError: if the xor bitstring exceeds available qubits.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverted BitwiseXorGate gate (itself).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as this gate
        is self-inverse.

Returns:
    BitwiseXorGate: inverse gate (self-inverse).

## `random_bitwise_xor`

```python
def random_bitwise_xor(num_qubits: int, seed: int) -> BitwiseXorGate
```

Create a random BitwiseXorGate.

Args:
    num_qubits: the width of circuit.
    seed: random seed in case a random xor is requested.
