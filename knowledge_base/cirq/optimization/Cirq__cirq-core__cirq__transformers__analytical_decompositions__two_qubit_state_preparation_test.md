---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/analytical_decompositions/two_qubit_state_preparation_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/two_qubit_state_preparation_test.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/analytical_decompositions/two_qubit_state_preparation_test.py`

Tests for efficient two qubit state preparation methods.

## `states_with_phases`

```python
def states_with_phases(st: np.ndarray) -> Iterator[np.ndarray]
```

Returns several states similar to st with modified global phases.
