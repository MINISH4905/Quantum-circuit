---
framework: qiskit
api_version: 2.5.2
doc_type: error
source_path: qiskit/providers/exceptions.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/providers/exceptions.py
license: Apache-2.0
---

## Module `qiskit/providers/exceptions.py`

Exceptions for errors raised while handling Backends and Jobs.

## `JobError`

```python
class JobError(QiskitError)
```

Base class for errors raised by Jobs.

## `JobTimeoutError`

```python
class JobTimeoutError(JobError)
```

Base class for timeout errors raised by jobs.

## `QiskitBackendNotFoundError`

```python
class QiskitBackendNotFoundError(QiskitError)
```

Base class for errors raised while looking for a backend.
