---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/two_qubit/local_invariance.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/two_qubit/local_invariance.py
license: Apache-2.0
---

## Module `qiskit/synthesis/two_qubit/local_invariance.py`

Routines that use local invariants to compute properties
of two-qubit unitary operators.

## `two_qubit_local_invariants`

```python
def two_qubit_local_invariants(U: np.ndarray) -> np.ndarray
```

Computes the local invariants for a two-qubit unitary.

Args:
    U (ndarray): Input two-qubit unitary.

Returns:
    ndarray: NumPy array of local invariants [g0, g1, g2].

Raises:
    ValueError: Input not a 2q unitary.

Notes:
    Y. Makhlin, Quant. Info. Proc. 1, 243-252 (2002).
    Zhang et al., Phys Rev A. 67, 042313 (2003).

## `local_equivalence`

```python
def local_equivalence(weyl: np.ndarray) -> np.ndarray
```

Computes the equivalent local invariants from the
Weyl coordinates.

Args:
    weyl (ndarray): Weyl coordinates.

Returns:
    ndarray: Local equivalent coordinates [g0, g1, g3].

Notes:
    This uses Eq. 30 from Zhang et al, PRA 67, 042313 (2003),
    but we multiply weyl coordinates by 2 since we are
    working in the reduced chamber.
