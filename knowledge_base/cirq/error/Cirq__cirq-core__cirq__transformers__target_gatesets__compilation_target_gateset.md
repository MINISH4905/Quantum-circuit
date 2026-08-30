---
framework: cirq
api_version: v1.7.0
doc_type: error
source_path: cirq-core/cirq/transformers/target_gatesets/compilation_target_gateset.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/target_gatesets/compilation_target_gateset.py
license: Apache-2.0
---

## Error surface of `cirq-core/cirq/transformers/target_gatesets/compilation_target_gateset.py`

### Validation

### `CompilationTargetGateset._validate_operation`

```python
def _validate_operation(self, op: cirq.Operation) -> bool
```

Validates whether the given `cirq.Operation` is contained in this Gateset.

Overrides the method on the base gateset class to ensure that operations which created
as intermediate compilation results are not accepted.
For example, if a preprocessing `merge_k_qubit_unitaries` transformer merges connected
component of 2q unitaries, it should not be accepted in the gateset so that so we can
use `decompose_to_target_gateset` to determine how to expand this component.

Args:
    op: The `cirq.Operation` instance to check containment for.

Returns:
    Whether the given operation is contained in the gateset.
