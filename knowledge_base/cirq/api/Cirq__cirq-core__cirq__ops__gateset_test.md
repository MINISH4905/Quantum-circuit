---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/gateset_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/gateset_test.py
license: Apache-2.0
---

## `CustomXGateFamily`

```python
class CustomXGateFamily(cirq.GateFamily)
```

Accepts all integer powers of CustomXPowGate

## `test_overlapping_gate_families`

```python
def test_overlapping_gate_families() -> None
```

Tests if a gate belongs both to an instance and type family
but is rejected by the type family it can still be accepted.
