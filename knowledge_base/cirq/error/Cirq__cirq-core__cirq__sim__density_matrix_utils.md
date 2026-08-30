---
framework: cirq
api_version: v1.7.0
doc_type: error
source_path: cirq-core/cirq/sim/density_matrix_utils.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/density_matrix_utils.py
license: Apache-2.0
---

## Error surface of `cirq-core/cirq/sim/density_matrix_utils.py`

### Validation

## `_validate_density_matrix_qid_shape`

```python
def _validate_density_matrix_qid_shape(density_matrix: np.ndarray, qid_shape: tuple[int, ...]) -> tuple[int, ...]
```

Validates that a tensor's shape is a valid shape for qids and returns the
qid shape.

## `_validate_num_qubits`

```python
def _validate_num_qubits(density_matrix: np.ndarray) -> int
```

Validates that matrix's shape is a valid shape for qubits.

This method only works on a qubit-only density matrix.  Use
`_validate_density_matrix_qid_shape` otherwise.
