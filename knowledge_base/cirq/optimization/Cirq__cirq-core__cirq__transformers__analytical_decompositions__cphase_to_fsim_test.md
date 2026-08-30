---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/analytical_decompositions/cphase_to_fsim_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/cphase_to_fsim_test.py
license: Apache-2.0
---

## `complement_intervals`

```python
def complement_intervals(intervals: Sequence[tuple[float, float]]) -> Sequence[tuple[float, float]]
```

Computes complement of union of intervals in [0, 2].
