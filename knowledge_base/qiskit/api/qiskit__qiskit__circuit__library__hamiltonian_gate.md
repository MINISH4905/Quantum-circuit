---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/hamiltonian_gate.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/hamiltonian_gate.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/hamiltonian_gate.py`

Gate described by the time evolution of a Hermitian Hamiltonian operator.

## `HamiltonianGate`

```python
class HamiltonianGate(Gate)
```

Class for representing evolution by a Hamiltonian operator as a gate.

This gate resolves to a :class:`~.library.UnitaryGate` as :math:`U(t) = \exp(-i t H)`,
which can be decomposed into basis gates if it is 2 qubits or less, or
simulated directly in Aer for more qubits.

### `__init__`

```python
def __init__(self, data: np.ndarray | Gate | BaseOperator, time: float | ParameterExpression, label: str | None=None) -> None
```

Args:
    data: A hermitian operator.
    time: Time evolution parameter.
    label: Unitary name for backend [Default: ``None``].

Raises:
    ValueError: if input data is not an N-qubit unitary operator.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return matrix for the unitary.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return the adjoint of the unitary.

### `conjugate`

```python
def conjugate(self)
```

Return the conjugate of the Hamiltonian.

### `adjoint`

```python
def adjoint(self)
```

Return the adjoint of the unitary.

### `transpose`

```python
def transpose(self)
```

Return the transpose of the Hamiltonian.

### `validate_parameter`

```python
def validate_parameter(self, parameter)
```

Hamiltonian parameter has to be an ndarray, operator or float.
