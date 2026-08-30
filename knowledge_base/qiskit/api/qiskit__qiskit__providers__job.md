---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/providers/job.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/providers/job.py
license: Apache-2.0
---

## Module `qiskit/providers/job.py`

Job abstract interface.

## `Job`

```python
class Job
```

Base common type for all versioned Job abstract classes.

Note this class should not be inherited from directly, it is intended
to be used for type checking. When implementing a provider you should use
the versioned abstract classes as the parent class and not this class
directly.

## `JobV1`

```python
class JobV1(Job, ABC)
```

Class to handle jobs

This first version of the Job abstract class is written to be mostly
backwards compatible with the legacy providers interface. This was done to ease
the transition for users and provider maintainers to the new versioned providers. Expect,
future versions of this abstract class to change the data model and
interface.

### `__init__`

```python
def __init__(self, backend: Backend | None, job_id: str, **kwargs) -> None
```

Initializes the asynchronous job.

Args:
    backend: the backend used to run the job.
    job_id: a unique id in the context of the backend used to run
        the job.
    kwargs: Any key value metadata to associate with this job.

### `job_id`

```python
def job_id(self) -> str
```

Return a unique id identifying the job.

### `backend`

```python
def backend(self) -> Backend
```

Return the backend where this job was executed.

### `done`

```python
def done(self) -> bool
```

Return whether the job has successfully run.

### `running`

```python
def running(self) -> bool
```

Return whether the job is actively running.

### `cancelled`

```python
def cancelled(self) -> bool
```

Return whether the job has been cancelled.

### `in_final_state`

```python
def in_final_state(self) -> bool
```

Return whether the job is in a final job state such as ``DONE`` or ``ERROR``.

### `wait_for_final_state`

```python
def wait_for_final_state(self, timeout: float | None=None, wait: float=5, callback: Callable | None=None) -> None
```

Poll the job status until it progresses to a final state such as ``DONE`` or ``ERROR``.

Args:
    timeout: Seconds to wait for the job. If ``None``, wait indefinitely.
    wait: Seconds between queries.
    callback: Callback function invoked after each query.
        The following positional arguments are provided to the callback function:

        * job_id: Job ID
        * job_status: Status of the job from the last query
        * job: This JobV1 instance

        Note: different subclass might provide different arguments to
        the callback function.

Raises:
    JobTimeoutError: If the job does not reach a final state before the
        specified timeout.

### `submit`

```python
def submit(self)
```

Submit the job to the backend for execution.

### `result`

```python
def result(self) -> Result
```

Return the results of the job.

### `cancel`

```python
def cancel(self)
```

Attempt to cancel the job.

### `status`

```python
def status(self) -> JobStatus
```

Return the status of the job, among the values of ``JobStatus``.
