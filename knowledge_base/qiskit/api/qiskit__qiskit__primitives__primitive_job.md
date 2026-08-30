---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/primitive_job.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/primitive_job.py
license: Apache-2.0
---

## Module `qiskit/primitives/primitive_job.py`

Job for the reference implementations of Primitives V1 and V2.

## `PrimitiveJob`

```python
class PrimitiveJob(BasePrimitiveJob[ResultT, JobStatus])
```

Handle to a job from the reference implementations of the primitives in Qiskit.

This is a concrete implementation of the :class:`.BasePrimitiveJob` interface.  See the
documentation of that class for a discussion of the interface.

Primitives implementers looking to create their own job classes should not subclass this, but
instead subclass the interface definition :class:`.BasePrimitiveJob`.

### `__init__`

```python
def __init__(self, function, *args, **kwargs)
```

Args:
    function: A callable function to execute the job.
    args: any additional positional arguments
    kwargs: any additional keyword arguments
