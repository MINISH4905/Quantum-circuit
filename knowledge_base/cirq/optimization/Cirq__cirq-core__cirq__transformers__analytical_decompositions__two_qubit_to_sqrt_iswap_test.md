---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/analytical_decompositions/two_qubit_to_sqrt_iswap_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/two_qubit_to_sqrt_iswap_test.py
license: Apache-2.0
---

## `perturbations_unitary`

```python
def perturbations_unitary(u: np.ndarray, amount=1e-10) -> Iterator[np.ndarray]
```

Returns several unitaries in the neighborhood of u to test for numerical
corner cases near critical values.
