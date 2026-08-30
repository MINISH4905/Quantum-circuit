---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/boolean_logic/quantum_or.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/boolean_logic/quantum_or.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/boolean_logic/quantum_or.py`

Boolean OR circuit and gate.

## `OR`

```python
class OR(QuantumCircuit)
```

A circuit implementing the logical OR operation on a number of qubits.

For the OR operation the state :math:`|1\rangle` is interpreted as ``True``. The result
qubit is flipped, if the state of any variable qubit is ``True``. The OR is implemented using
a multi-open-controlled X gate (i.e. flips if the state is :math:`|0\rangle`) and
applying an X gate on the result qubit.
Using a list of flags, qubits can be skipped or negated.

The OR gate without special flags:

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import OR
   from qiskit.visualization.library import _generate_circuit_library_visualization
   circuit = OR(5)
   _generate_circuit_library_visualization(circuit)

Using flags we can negate qubits or skip them. For instance, if we have 5 qubits and want to
return ``True`` if the first qubit is ``False`` or one of the last two are ``True`` we use the
flags ``[-1, 0, 0, 1, 1]``.

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import OR
   from qiskit.visualization.library import _generate_circuit_library_visualization
   circuit = OR(5, flags=[-1, 0, 0, 1, 1])
   _generate_circuit_library_visualization(circuit)

### `__init__`

```python
def __init__(self, num_variable_qubits: int, flags: list[int] | None=None, mcx_mode: str='noancilla') -> None
```

Args:
    num_variable_qubits: The qubits of which the OR is computed. The result will be written
        into an additional result qubit.
    flags: A list of +1/0/-1 marking negations or omissions of qubits.
    mcx_mode: The mode to be used to implement the multi-controlled X gate.

## `OrGate`

```python
class OrGate(Gate)
```

A gate representing the logical OR operation on a number of qubits.

For the OR operation the state :math:`|1\rangle` is interpreted as ``True``. The result
qubit is flipped, if the state of any variable qubit is ``True``. The OR is implemented using
a multi-open-controlled X gate (i.e. flips if the state is :math:`|0\rangle`) and
applying an X gate on the result qubit.
Using a list of flags, qubits can be skipped or negated.

The OrGate gate without special flags:

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit import QuantumCircuit
   from qiskit.circuit.library import OrGate
   from qiskit.visualization.library import _generate_circuit_library_visualization
   circuit = QuantumCircuit(6)
   circuit.append(OrGate(5), [0, 1, 2, 3, 4, 5])
   _generate_circuit_library_visualization(circuit)

Using flags we can negate qubits or skip them. For instance, if we have 5 qubits and want to
return ``True`` if the first qubit is ``False`` or one of the last two are ``True`` we use the
flags ``[-1, 0, 0, 1, 1]``.

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit import QuantumCircuit
   from qiskit.circuit.library import OrGate
   from qiskit.visualization.library import _generate_circuit_library_visualization
   circuit = QuantumCircuit(6)
   circuit.append(OrGate(5, flags=[-1, 0, 0, 1, 1]), [0, 1, 2, 3, 4, 5])
   _generate_circuit_library_visualization(circuit)

### `__init__`

```python
def __init__(self, num_variable_qubits: int, flags: list[int] | None=None) -> None
```

Args:
    num_variable_qubits: The qubits of which the OR is computed. The result will be written
        into an additional result qubit.
    flags: A list of +1/0/-1 marking negations or omissions of qubits.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverted OR gate (itself).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as this gate
        is self-inverse.

Returns:
    OrGate: inverse gate (self-inverse).
