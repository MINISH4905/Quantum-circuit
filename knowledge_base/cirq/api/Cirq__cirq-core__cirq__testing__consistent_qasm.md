---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/consistent_qasm.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/consistent_qasm.py
license: Apache-2.0
---

## `assert_qasm_is_consistent_with_unitary`

```python
def assert_qasm_is_consistent_with_unitary(val: Any) -> None
```

Uses `val._unitary_` to check `val._qasm_`'s behavior.
