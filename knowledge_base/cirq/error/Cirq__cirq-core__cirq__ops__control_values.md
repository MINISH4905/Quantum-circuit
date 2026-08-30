---
framework: cirq
api_version: v1.7.0
doc_type: error
source_path: cirq-core/cirq/ops/control_values.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/control_values.py
license: Apache-2.0
---

## Error surface of `cirq-core/cirq/ops/control_values.py`

### Validation

### `AbstractControlValues.validate`

```python
def validate(self, qid_shapes: Sequence[int]) -> None
```

Validates that all control values for ith qubit are in range [0, qid_shaped[i])
