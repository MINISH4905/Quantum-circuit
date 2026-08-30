---
framework: cirq
api_version: v1.7.0
doc_type: error
source_path: cirq-core/cirq/transformers/analytical_decompositions/pauli_string_decomposition.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/pauli_string_decomposition.py
license: Apache-2.0
---

## Error surface of `cirq-core/cirq/transformers/analytical_decompositions/pauli_string_decomposition.py`

### Validation

## `_validate_decomposition`

```python
def _validate_decomposition(decomposition: DensePauliString, U: npt.NDArray, eps: float) -> bool
```

Returns whether the max absolute value of the elementwise difference is less than eps.
