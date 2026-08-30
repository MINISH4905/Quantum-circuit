---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/providers/basic_provider/basic_provider_job.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/providers/basic_provider/basic_provider_job.py
license: Apache-2.0
---

## Module `qiskit/providers/basic_provider/basic_provider_job.py`

This module implements the job class used by Basic Aer Provider.

## `BasicProviderJob`

```python
class BasicProviderJob(JobV1)
```

BasicProviderJob class.

### `submit`

```python
def submit(self)
```

Submit the job to the backend for execution.

Raises:
    JobError: if trying to re-submit the job.

### `result`

```python
def result(self, timeout=None)
```

Get job result .

Returns:
    qiskit.result.Result: Result object

### `status`

```python
def status(self)
```

Gets the status of the job by querying the Python's future

Returns:
    qiskit.providers.JobStatus: The current JobStatus

### `backend`

```python
def backend(self)
```

Return the instance of the backend used for this job.
