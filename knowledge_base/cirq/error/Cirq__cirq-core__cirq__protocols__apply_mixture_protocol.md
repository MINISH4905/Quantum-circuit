---
framework: cirq
api_version: v1.7.0
doc_type: error
source_path: cirq-core/cirq/protocols/apply_mixture_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/apply_mixture_protocol.py
license: Apache-2.0
---

## Error surface of `cirq-core/cirq/protocols/apply_mixture_protocol.py`

### Validation

## `_validate_input`

```python
def _validate_input(val: Any, args: ApplyMixtureArgs) -> tuple[Any, ApplyMixtureArgs, bool]
```

Validate args input and determine if we are operating on a
density matrix or a state vector.
