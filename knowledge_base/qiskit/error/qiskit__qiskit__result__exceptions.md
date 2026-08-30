---
framework: qiskit
api_version: 2.5.2
doc_type: error
source_path: qiskit/result/exceptions.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/result/exceptions.py
license: Apache-2.0
---

## Module `qiskit/result/exceptions.py`

Exception for errors when there's an error in the Result

## `ResultError`

```python
class ResultError(QiskitError)
```

Exceptions raised due to errors in result output.

It may be better for the Qiskit API to raise this exception.

Args:
    error (dict): This is the error record as it comes back from
        the API. The format is like::

            error = {'status': 403,
                     'message': 'Your credits are not enough.',
                     'code': 'MAX_CREDITS_EXCEEDED'}
