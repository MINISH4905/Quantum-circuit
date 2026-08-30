---
framework: cirq
api_version: v1.7.0
doc_type: error
source_path: cirq-core/cirq/ops/gateset.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/gateset.py
license: Apache-2.0
---

## Error surface of `cirq-core/cirq/ops/gateset.py`

### Validation

### `Gateset.validate`

```python
def validate(self, circuit_or_optree: cirq.AbstractCircuit | op_tree.OP_TREE) -> bool
```

Validates gates forming `circuit_or_optree` should be contained in Gateset.

Args:
    circuit_or_optree: The `cirq.Circuit` or `cirq.OP_TREE` to validate.

### `Gateset._validate_operation`

```python
def _validate_operation(self, op: raw_types.Operation) -> bool
```

Validates whether the given `cirq.Operation` is contained in this Gateset.

The containment checks are handled as follows:

- For any operation which has an underlying gate (i.e. `op.gate` is not None):
    - Containment is checked via `self.__contains__` which further checks for containment
        in any of the underlying gate families.
- For all other types of operations (eg: `cirq.CircuitOperation`,
    etc):
    - The behavior is controlled via flags passed to the constructor.

Users should override this method to define custom behavior for operations that do not
have an underlying `cirq.Gate`.

Args:
    op: The `cirq.Operation` instance to check containment for.
