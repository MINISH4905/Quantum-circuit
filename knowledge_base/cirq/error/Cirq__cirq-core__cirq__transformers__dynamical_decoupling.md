---
framework: cirq
api_version: v1.7.0
doc_type: error
source_path: cirq-core/cirq/transformers/dynamical_decoupling.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/dynamical_decoupling.py
license: Apache-2.0
---

## Error surface of `cirq-core/cirq/transformers/dynamical_decoupling.py`

### Validation

## `_validate_dd_sequence`

```python
def _validate_dd_sequence(dd_sequence: tuple[ops.Gate, ...]) -> None
```

Validates a given dynamical decoupling sequence.

The sequence should only consist of Pauli gates and is essentially an identity gate.

Args:
    dd_sequence: Input dynamical sequence to be validated.

Raises:
    ValueError: If dd_sequence is not valid.
