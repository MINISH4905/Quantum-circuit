---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/basis_change/qft.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/basis_change/qft.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/basis_change/qft.py`

Define a Quantum Fourier Transform circuit (QFT) and a native gate (QFTGate).

## `QFT`

```python
class QFT(BlueprintCircuit)
```

Quantum Fourier Transform Circuit.

The Quantum Fourier Transform (QFT) on :math:`n` qubits is the operation

.. math::

    |j\rangle \mapsto \frac{1}{2^{n/2}} \sum_{k=0}^{2^n - 1} e^{2\pi ijk / 2^n} |k\rangle

The circuit that implements this transformation can be implemented using Hadamard gates
on each qubit, a series of controlled-U1 (or Z, depending on the phase) gates and a
layer of Swap gates. The layer of Swap gates can in principle be dropped if the QFT appears
at the end of the circuit, since then the re-ordering can be done classically. They
can be turned off using the ``do_swaps`` attribute.

For 4 qubits, the circuit that implements this transformation is:

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import QFT
   from qiskit.visualization.library import _generate_circuit_library_visualization
   circuit = QFT(4)
   _generate_circuit_library_visualization(circuit)

The inverse QFT can be obtained by calling the ``inverse`` method on this class.
The respective circuit diagram is:

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import QFT
   from qiskit.visualization.library import _generate_circuit_library_visualization
   circuit = QFT(4).inverse()
   _generate_circuit_library_visualization(circuit)

One method to reduce circuit depth is to implement the QFT approximately by ignoring
controlled-phase rotations where the angle is beneath a threshold. This is discussed
in more detail in https://arxiv.org/abs/quant-ph/9601018 or
https://arxiv.org/abs/quant-ph/0403071.

Here, this can be adjusted using the ``approximation_degree`` attribute: the smallest
``approximation_degree`` rotation angles are dropped from the QFT. For instance, a QFT
on 5 qubits with approximation degree 2 yields (the barriers are dropped in this example):

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import QFT
   from qiskit.visualization.library import _generate_circuit_library_visualization
   circuit = QFT(5, approximation_degree=2)
   _generate_circuit_library_visualization(circuit)

### `__init__`

```python
def __init__(self, num_qubits: int | None=None, approximation_degree: int=0, do_swaps: bool=True, inverse: bool=False, insert_barriers: bool=False, name: str | None=None) -> None
```

Args:
    num_qubits: The number of qubits on which the QFT acts.
    approximation_degree: The degree of approximation (0 for no approximation).
    do_swaps: Whether to include the final swaps in the QFT.
    inverse: If True, the inverse Fourier transform is constructed.
    insert_barriers: If True, barriers are inserted as visualization improvement.
    name: The name of the circuit.

### `num_qubits`

```python
def num_qubits(self) -> int
```

The number of qubits in the QFT circuit.

Returns:
    The number of qubits in the circuit.

### `num_qubits`

```python
def num_qubits(self, num_qubits: int) -> None
```

Set the number of qubits.

Note that this changes the registers of the circuit.

Args:
    num_qubits: The new number of qubits.

### `approximation_degree`

```python
def approximation_degree(self) -> int
```

The approximation degree of the QFT.

Returns:
    The currently set approximation degree.

### `approximation_degree`

```python
def approximation_degree(self, approximation_degree: int) -> None
```

Set the approximation degree of the QFT.

Args:
    approximation_degree: The new approximation degree.

Raises:
    ValueError: If the approximation degree is smaller than 0.

### `insert_barriers`

```python
def insert_barriers(self) -> bool
```

Whether barriers are inserted for better visualization or not.

Returns:
    True, if barriers are inserted, False if not.

### `insert_barriers`

```python
def insert_barriers(self, insert_barriers: bool) -> None
```

Specify whether barriers are inserted for better visualization or not.

Args:
    insert_barriers: If True, barriers are inserted, if False not.

### `do_swaps`

```python
def do_swaps(self) -> bool
```

Whether the final swaps of the QFT are applied or not.

Returns:
    True, if the final swaps are applied, False if not.

### `do_swaps`

```python
def do_swaps(self, do_swaps: bool) -> None
```

Specify whether to do the final swaps of the QFT circuit or not.

Args:
    do_swaps: If True, the final swaps are applied, if False not.

### `is_inverse`

```python
def is_inverse(self) -> bool
```

Whether the inverse Fourier transform is implemented.

Returns:
    True, if the inverse Fourier transform is implemented, False otherwise.

### `inverse`

```python
def inverse(self, annotated: bool=False) -> QFT
```

Invert this circuit.

Args:
    annotated: indicates whether the inverse gate can be implemented
        as an annotated gate. The value of this argument is ignored as the
        inverse of a QFT is an IQFT which is just another instance of
        :class:`.QFT`.

Returns:
    The inverted circuit.

## `QFTGate`

```python
class QFTGate(Gate)
```

Quantum Fourier Transform Gate.

The Quantum Fourier Transform (QFT) on :math:`n` qubits is the operation

.. math::

    |j\rangle \mapsto \frac{1}{2^{n/2}} \sum_{k=0}^{2^n - 1} e^{2\pi ijk / 2^n} |k\rangle

### `__init__`

```python
def __init__(self, num_qubits: int)
```

Args:
    num_qubits: The number of qubits on which the QFT acts.

### `__array__`

```python
def __array__(self, dtype=complex, copy=None)
```

Return a numpy array for the QFTGate.
