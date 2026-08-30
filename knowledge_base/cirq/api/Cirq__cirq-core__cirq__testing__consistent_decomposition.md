---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/consistent_decomposition.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/consistent_decomposition.py
license: Apache-2.0
---

## `assert_decompose_is_consistent_with_unitary`

```python
def assert_decompose_is_consistent_with_unitary(val: Any, ignoring_global_phase: bool=False) -> None
```

Uses `val._unitary_` to check `val._phase_by_`'s behavior.

## `assert_decompose_ends_at_default_gateset`

```python
def assert_decompose_ends_at_default_gateset(val: Any, ignore_known_gates: bool=True) -> None
```

Asserts that cirq.decompose(val) ends at default cirq gateset or a known gate.
