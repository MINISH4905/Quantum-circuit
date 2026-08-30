---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/linear/linear_circuits_utils.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/linear/linear_circuits_utils.py
license: Apache-2.0
---

## Module `qiskit/synthesis/linear/linear_circuits_utils.py`

Utility functions for handling linear reversible circuits.

## `transpose_cx_circ`

```python
def transpose_cx_circ(qc: QuantumCircuit)
```

Takes a circuit having only CX gates, and calculates its transpose.
This is done by recursively replacing CX(i, j) with CX(j, i) in all instructions.

Args:
    qc: a :class:`.QuantumCircuit` containing only CX gates.

Returns:
    QuantumCircuit: the transposed circuit.

Raises:
    CircuitError: if qc has a non-CX gate.

## `optimize_cx_4_options`

```python
def optimize_cx_4_options(function: Callable, mat: np.ndarray, optimize_count: bool=True)
```

Get the best implementation of a circuit implementing a binary invertible matrix M,
by considering all four options: M,M^(-1),M^T,M^(-1)^T.
Optimizing either the CX count or the depth.

Args:
    function: the synthesis function.
    mat: a binary invertible matrix.
    optimize_count: True if the number of CX gates is optimized, False if the depth is optimized.

Returns:
    QuantumCircuit: an optimized :class:`.QuantumCircuit`, has the best depth or CX count of
        the four options.

Raises:
    QiskitError: if mat is not an invertible matrix.

## `check_lnn_connectivity`

```python
def check_lnn_connectivity(qc: QuantumCircuit) -> bool
```

Check that the synthesized circuit qc fits linear nearest neighbor connectivity.

Args:
    qc: a :class:`.QuantumCircuit` containing only CX and single qubit gates.

Returns:
    bool: True if the circuit has linear nearest neighbor connectivity.

Raises:
    CircuitError: if qc has a non-CX two-qubit gate.
