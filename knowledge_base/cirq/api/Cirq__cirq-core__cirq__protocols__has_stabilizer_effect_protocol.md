---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/has_stabilizer_effect_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/has_stabilizer_effect_protocol.py
license: Apache-2.0
---

## `has_stabilizer_effect`

```python
def has_stabilizer_effect(val: Any) -> bool
```

Returns whether the input has a stabilizer effect.

For 1-qubit gates always returns correct result. For other operations relies
on the operation to define whether it has stabilizer effect.
