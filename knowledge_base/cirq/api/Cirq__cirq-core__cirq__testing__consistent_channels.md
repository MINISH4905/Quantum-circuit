---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/consistent_channels.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/consistent_channels.py
license: Apache-2.0
---

## `assert_consistent_channel`

```python
def assert_consistent_channel(gate: Any, rtol: float=1e-05, atol: float=1e-08) -> None
```

Asserts that a given gate has Kraus operators and that they are properly normalized.

## `assert_consistent_mixture`

```python
def assert_consistent_mixture(gate: Any, rtol: float=1e-05, atol: float=1e-08) -> None
```

Asserts that a given gate is a mixture and the mixture probabilities sum to one.
