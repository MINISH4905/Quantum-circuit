---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/operation.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/operation.py
license: Apache-2.0
---

## Module `qiskit/circuit/operation.py`

Quantum Operation Mixin.

## `Operation`

```python
class Operation(ABC)
```

Quantum operation interface.

The minimal interface that any object must fulfil in order to be added to a
:class:`.QuantumCircuit`.

Concrete instances of this interface include :class:`~qiskit.circuit.Gate`,
:class:`~qiskit.circuit.Reset`, :class:`~qiskit.circuit.Barrier`,
:class:`~qiskit.circuit.Measure`, and operators such as :class:`~qiskit.quantum_info.Clifford`.

The main purpose is to allow abstract mathematical objects to be added directly onto
abstract circuits, and for the exact syntheses of these to be determined later, during
compilation.

Example:

    Add a Clifford and a Toffoli gate to a :class:`QuantumCircuit`.

    .. plot::
       :alt: Circuit diagram output by the previous code.
       :include-source:

       from qiskit import QuantumCircuit
       from qiskit.quantum_info import Clifford, random_clifford

       qc = QuantumCircuit(3)
       cliff = random_clifford(2)
       qc.append(cliff, [0, 1])
       qc.ccx(0, 1, 2)
       qc.draw('mpl')

### `name`

```python
def name(self)
```

Unique string identifier for operation type.

### `num_qubits`

```python
def num_qubits(self)
```

Number of qubits.

### `num_clbits`

```python
def num_clbits(self)
```

Number of classical bits.
