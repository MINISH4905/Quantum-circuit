---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/unitary/aqc/elementary_operations.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/unitary/aqc/elementary_operations.py
license: Apache-2.0
---

## Module `qiskit/synthesis/unitary/aqc/elementary_operations.py`

These are a number of elementary functions that are required for the AQC routines to work.

## `place_unitary`

```python
def place_unitary(unitary: np.ndarray, n: int, j: int) -> np.ndarray
```

Computes I(j - 1) tensor product U tensor product I(n - j), where U is a unitary matrix
of size ``(2, 2)``.

Args:
    unitary: a unitary matrix of size ``(2, 2)``.
    n: num qubits.
    j: position where to place a unitary.

Returns:
    a unitary of n qubits with u in position j.

## `place_cnot`

```python
def place_cnot(n: int, j: int, k: int) -> np.ndarray
```

Places a CNOT from j to k.

Args:
    n: number of qubits.
    j: control qubit.
    k: target qubit.

Returns:
    a unitary of n qubits with CNOT placed at ``j`` and ``k``.

## `rx_matrix`

```python
def rx_matrix(phi: float) -> np.ndarray
```

Computes an RX rotation by the angle of ``phi``.

Args:
    phi: rotation angle.

Returns:
    an RX rotation matrix.

## `ry_matrix`

```python
def ry_matrix(phi: float) -> np.ndarray
```

Computes an RY rotation by the angle of ``phi``.

Args:
    phi: rotation angle.

Returns:
    an RY rotation matrix.

## `rz_matrix`

```python
def rz_matrix(phi: float) -> np.ndarray
```

Computes an RZ rotation by the angle of ``phi``.

Args:
    phi: rotation angle.

Returns:
    an RZ rotation matrix.
