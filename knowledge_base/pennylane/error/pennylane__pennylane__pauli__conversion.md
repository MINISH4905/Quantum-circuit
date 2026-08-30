---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/pauli/conversion.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/pauli/conversion.py
license: Apache-2.0
---

## Error surface of `pennylane/pauli/conversion.py`

### Validation

## `_validate_and_normalize_decomposition_inputs`

```python
def _validate_and_normalize_decomposition_inputs(shape, wire_order=None, is_sparse=False)
```

Validate matrix shape and wire order for Pauli decomposition.

Args:
    shape: Matrix shape tuple (rows, cols)
    wire_order: Optional list of wires. If None, will be set to range(num_qubits)
    is_sparse: Whether the matrix is sparse (for additional empty matrix check)

Returns:
    tuple: (num_qubits, wire_order) where wire_order is normalized

Raises:
    ValueError: If shape is invalid or wire_order is incompatible

## `_validate_sparse_matrix_shape`

```python
def _validate_sparse_matrix_shape(shape)
```

Validate that a sparse matrix has the correct shape for decomposition.

Args:
    shape: Matrix shape tuple (rows, cols)

Raises:
    ValueError: If shape is invalid for decomposition
