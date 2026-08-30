---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/pytest_utils.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/pytest_utils.py
license: Apache-2.0
---

## Module `cirq-core/cirq/testing/pytest_utils.py`

Support one retry of tests that fail for a specific seed from pytest-randomly.

## `retry_once_after_timeout`

```python
def retry_once_after_timeout(testfunc: Callable) -> Callable
```

Marks a test function for one retry if it fails with TimeoutError.

This decorator is intended for test functions which occasionally fail
with TimeoutError.

## `retry_once_with_later_random_values`

```python
def retry_once_with_later_random_values(testfunc: Callable) -> Callable
```

Marks a test function for one retry with later random values.

This decorator is intended for test functions which occasionally fail
for specific random seeds from pytest-randomly.
