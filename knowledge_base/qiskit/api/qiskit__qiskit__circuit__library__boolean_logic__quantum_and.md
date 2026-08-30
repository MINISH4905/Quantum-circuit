---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/boolean_logic/quantum_and.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/boolean_logic/quantum_and.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/boolean_logic/quantum_and.py`

Boolean AND circuit and gate.

## `AND`

```python
class AND(QuantumCircuit)
```

A circuit implementing the logical AND operation on a number of qubits.

For the AND operation the state :math:`|1\rangle` is interpreted as ``True``. The result
qubit is flipped, if the state of all variable qubits is ``True``. In this format, the AND
operation equals a multi-controlled X gate, which is controlled on all variable qubits.
Using a list of flags however, qubits can be skipped or negated. Practically, the flags
allow to skip controls or to apply pre- and post-X gates to the negated qubits.

The AND gate without special flags equals the multi-controlled-X gate:

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import AND
   from qiskit.visualization.library import _generate_circuit_library_visualization
   circuit = AND(5)
   _generate_circuit_library_visualization(circuit)

Using flags we can negate qubits or skip them. For instance, if we have 5 qubits and want to
return ``True`` if the first qubit is ``False`` and the last two are ``True`` we use the flags
``[-1, 0, 0, 1, 1]``.

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import AND
   from qiskit.visualization.library import _generate_circuit_library_visualization
   circuit = AND(5, flags=[-1, 0, 0, 1, 1])
   _generate_circuit_library_visualization(circuit)

### `__init__`

```python
def __init__(self, num_variable_qubits: int, flags: list[int] | None=None, mcx_mode: str='noancilla') -> None
```

Args:
    num_variable_qubits: The qubits of which the AND is computed. The result will be written
        into an additional result qubit.
    flags: A list of +1/0/-1 marking negations or omissions of qubits.
    mcx_mode: The mode to be used to implement the multi-controlled X gate.

## `AndGate`

```python
class AndGate(Gate)
```

A gate representing the logical AND operation on a number of qubits.

For the AND operation the state :math:`|1\rangle` is interpreted as ``True``. The result
qubit is flipped, if the state of all variable qubits is ``True``. In this format, the AND
operation equals a multi-controlled X gate, which is controlled on all variable qubits.
Using a list of flags however, qubits can be skipped or negated. Practically, the flags
allow to skip controls or to apply pre- and post-X gates to the negated qubits.

The AndGate gate without special flags equals the multi-controlled-X gate:

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit import QuantumCircuit
   from qiskit.circuit.library import AndGate
   from qiskit.visualization.library import _generate_circuit_library_visualization
   circuit = QuantumCircuit(6)
   circuit.append(AndGate(5), [0, 1, 2, 3, 4, 5])
   _generate_circuit_library_visualization(circuit)

Using flags we can negate qubits or skip them. For instance, if we have 5 qubits and want to
return ``True`` if the first qubit is ``False`` and the last two are ``True`` we use the flags
``[-1, 0, 0, 1, 1]``.

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit import QuantumCircuit
   from qiskit.circuit.library import AndGate
   from qiskit.visualization.library import _generate_circuit_library_visualization
   circuit = QuantumCircuit(6)
   circuit.append(AndGate(5, flags=[-1, 0, 0, 1, 1]), [0, 1, 2, 3, 4, 5])
   _generate_circuit_library_visualization(circuit)

### `__init__`

```python
def __init__(self, num_variable_qubits: int, flags: list[int] | None=None) -> None
```

Args:
    num_variable_qubits: The qubits of which the AND is computed. The result will be written
        into an additional result qubit.
    flags: A list of +1/0/-1 marking negations or omissions of qubits.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverted AND gate (itself).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as this gate
        is self-inverse.

Returns:
    AndGate: inverse gate (self-inverse).
