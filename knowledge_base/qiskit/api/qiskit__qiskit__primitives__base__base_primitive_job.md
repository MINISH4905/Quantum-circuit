---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/base/base_primitive_job.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/base/base_primitive_job.py
license: Apache-2.0
---

## Module `qiskit/primitives/base/base_primitive_job.py`

Primitive job abstract base class

## `BasePrimitiveJob`

```python
class BasePrimitiveJob(ABC, Generic[ResultT, StatusT])
```

Primitive job abstract base class.

This defines the functionality of the "job handle" object you get by a call to
``primitive.run()``.  Typically this object represents a handle to an asynchronous task, where
the :meth:`status`, :meth:`done`, :meth:`running`, :meth:`cancelled` and :meth:`in_final_state`
methods return non-blocking information on the state of the task.

The method :meth:`result` is typically implemented as a blocking call that waits for the
execution result to return.  Use of this job object almost invariably ends in a call to
:meth:`result`.

.. note::

    This is an abstract base class, defining an interface.  Each primitives provider (for
    example, :mod:`qiskit_aer` or :mod:`qiskit_ibm_runtime`) will have its own subclass of this
    object, which may provide additional functionality on top of this interface.

Subclassing
===========

Each implementer of the primitives should provide a concrete implementation of this interface.
There are no provided methods on the base implementation, other than the :meth:`job_id` getter,
since a string key uniquely identifying jobs is a requirement of all primitives.

The ``ResultT`` generic type should be set to a subclass of the appropriate versioned primitive
result.  This typically will mean setting it to :class:`.PrimitiveResult` (for V2), or an
implementation-specific subclass of this.

The ``StatusT`` generic type is completely freeform; your implementation can provide any status
object you like and there is no defined interface.  Instead, the :meth:`done`, :meth:`running`,
:meth:`cancelled` and :meth:`in_final_state` methods of this interface should be implemented to
give the user simple programmatic access to coarse-grained status information.  You can provide
additional details in the complete ``StatusT`` generic.

Creating this "job" handle is conventionally expected (but not strictly *required*) to be fast
and non-blocking, and for this object to hold an internal asynchronous handle to the actual job.
The :meth:`result` method should typically block until ready, if called before the job has
completed.

### `__init__`

```python
def __init__(self, job_id: str, **kwargs) -> None
```

Initializes the primitive job.

Args:
    job_id: A unique id in the context of the primitive used to run the job.
    kwargs: Any key value metadata to associate with this job.

### `job_id`

```python
def job_id(self) -> str
```

Return a unique id identifying the job.

### `result`

```python
def result(self) -> ResultT
```

Return the results of the job.

### `status`

```python
def status(self) -> StatusT
```

Return the status of the job.

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

### `cancel`

```python
def cancel(self)
```

Attempt to cancel the job.
