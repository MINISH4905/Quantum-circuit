---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/work/sampler_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/work/sampler_test.py
license: Apache-2.0
---

## Module `cirq-core/cirq/work/sampler_test.py`

Tests for cirq.Sampler.

## `test_run_sweep_impl`

```python
def test_run_sweep_impl() -> None
```

Test run_sweep implemented in terms of run_sweep_async.

## `test_run_sweep_async_impl`

```python
async def test_run_sweep_async_impl() -> None
```

Test run_sweep_async implemented in terms of run_sweep.

## `test_run_batch_async_calls_run_sweep_asynchronously`

```python
async def test_run_batch_async_calls_run_sweep_asynchronously() -> None
```

Test run_batch_async calls run_sweep_async without waiting.
