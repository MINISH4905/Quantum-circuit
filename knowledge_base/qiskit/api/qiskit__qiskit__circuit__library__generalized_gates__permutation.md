---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/generalized_gates/permutation.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/generalized_gates/permutation.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/generalized_gates/permutation.py`

Permutation circuit (the old way to specify permutations, which is required for
backward compatibility and which will be eventually deprecated) and the permutation
gate (the new way to specify permutations, allowing a variety of synthesis algorithms).

## `Permutation`

```python
class Permutation(QuantumCircuit)
```

An n_qubit circuit that permutes qubits.

### `__init__`

```python
def __init__(self, num_qubits: int, pattern: list[int] | np.ndarray | None=None, seed: int | None=None) -> None
```

Args:
    num_qubits: circuit width.
    pattern: permutation pattern, describing which qubits occupy the
        positions 0, 1, 2, etc. after applying the permutation, that
        is ``pattern[k] = m`` when the permutation maps qubit ``m``
        to position ``k``. As an example, the pattern ``[2, 4, 3, 0, 1]``
        means that qubit ``2`` goes to position ``0``, qubit ``4``
        goes to the position ``1``, etc. The pattern can also be ``None``,
        in which case a random permutation over ``num_qubits`` is
        created.
    seed: random seed in case a random permutation is requested.

Raises:
    CircuitError: if permutation pattern is malformed.

Reference Circuit:

.. plot::
    :alt: Diagram illustrating the previously described circuit.

    from qiskit.circuit.library import Permutation
    A = [2,4,3,0,1]
    circuit = Permutation(5, A)
    circuit.draw('mpl')

Expanded Circuit:

.. plot::
    :alt: Diagram illustrating the previously described circuit.

    from qiskit.circuit.library import Permutation
    from qiskit.visualization.library import _generate_circuit_library_visualization
    A = [2,4,3,0,1]
    circuit = Permutation(5, A)
    _generate_circuit_library_visualization(circuit.decompose())

## `PermutationGate`

```python
class PermutationGate(Gate)
```

A gate that permutes qubits.

### `__init__`

```python
def __init__(self, pattern: list[int]) -> None
```

Return a permutation gate.

Args:
    pattern: permutation pattern, describing which qubits occupy the
        positions 0, 1, 2, etc. after applying the permutation, that
        is ``pattern[k] = m`` when the permutation maps qubit ``m``
        to position ``k``. As an example, the pattern ``[2, 4, 3, 0, 1]``
        means that qubit ``2`` goes to position ``0``, qubit ``4``
        goes to the position ``1``, etc.

Raises:
    CircuitError: if permutation pattern is malformed.

Reference Circuit:
    .. plot::
       :alt: Diagram illustrating the previously described circuit.

        from qiskit.circuit.quantumcircuit import QuantumCircuit
        from qiskit.circuit.library import PermutationGate
        A = [2, 4, 3, 0, 1]
        permutation = PermutationGate(A)
        circuit = QuantumCircuit(5)
        circuit.append(permutation, [0, 1, 2, 3, 4])
        circuit.draw("mpl")

Expanded Circuit:
    .. plot::
       :alt: Diagram illustrating the previously described circuit.

        from qiskit.circuit.quantumcircuit import QuantumCircuit
        from qiskit.circuit.library import PermutationGate
        from qiskit.visualization.library import _generate_circuit_library_visualization
        A = [2, 4, 3, 0, 1]
        permutation = PermutationGate(A)
        circuit = QuantumCircuit(5)
        circuit.append(permutation, [0, 1, 2, 3, 4])

        _generate_circuit_library_visualization(circuit.decompose())

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a numpy.array for the Permutation gate.

### `validate_parameter`

```python
def validate_parameter(self, parameter)
```

Parameter validation.

### `pattern`

```python
def pattern(self) -> np.ndarray[bool]
```

Returns the permutation pattern defining this permutation.

### `inverse`

```python
def inverse(self, annotated: bool=False) -> PermutationGate
```

Returns the inverse of the permutation.
