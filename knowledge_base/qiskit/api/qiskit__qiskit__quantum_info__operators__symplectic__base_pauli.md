---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/symplectic/base_pauli.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/symplectic/base_pauli.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/symplectic/base_pauli.py`

Optimized list of Pauli operators

## `BasePauli`

```python
class BasePauli(BaseOperator, AdjointMixin, MultiplyMixin)
```

Symplectic representation of a list of N-qubit Paulis.

Base class for Pauli and PauliList.

### `__init__`

```python
def __init__(self, z: np.ndarray, x: np.ndarray, phase: np.ndarray)
```

Initialize the BasePauli.

This is an array of M N-qubit Paulis defined as
P = (-i)^phase Z^z X^x.

Args:
    z (np.ndarray): input z matrix.
    x (np.ndarray): input x matrix.
    phase (np.ndarray): input phase vector.

### `copy`

```python
def copy(self)
```

Make a deep copy of current operator.

### `conjugate`

```python
def conjugate(self)
```

Return the complex conjugate of the Pauli with respect to the Z basis.

### `transpose`

```python
def transpose(self)
```

Return the transpose of each Pauli in the list.

### `commutes`

```python
def commutes(self, other: BasePauli, qargs: list | None=None) -> np.ndarray
```

Return ``True`` if Pauli commutes with ``other``.

Args:
    other (BasePauli): another BasePauli operator.
    qargs (list): qubits to apply dot product on (default: ``None``).

Returns:
    np.array: Boolean array of ``True`` if Paulis commute, ``False`` if
              they anti-commute.

Raises:
    QiskitError: if number of qubits of ``other`` does not match ``qargs``.

### `evolve`

```python
def evolve(self, other: BasePauli | QuantumCircuit | Clifford, qargs: list | None=None, frame: Literal['h', 's']='h') -> BasePauli
```

Performs either Heisenberg (default) or Schrödinger picture
evolution of the Pauli by a Clifford and returns the evolved Pauli.

Schrödinger picture evolution can be chosen by passing parameter ``frame='s'``.
This option yields a faster calculation.

Heisenberg picture evolves the Pauli as :math:`P^\prime = C^\dagger.P.C`.

Schrödinger picture evolves the Pauli as :math:`P^\prime = C.P.C^\dagger`.

Args:
    other (BasePauli or QuantumCircuit): The Clifford circuit to evolve by.
    qargs (list): a list of qubits to apply the Clifford to.
    frame (string): ``'h'`` for Heisenberg or ``'s'`` for Schrödinger framework.

Returns:
    BasePauli: the Pauli :math:`C^\dagger.P.C` (Heisenberg picture)
    or the Pauli :math:`C.P.C^\dagger` (Schrödinger picture).

Raises:
    QiskitError: if the Clifford number of qubits and ``qargs`` don't match.
