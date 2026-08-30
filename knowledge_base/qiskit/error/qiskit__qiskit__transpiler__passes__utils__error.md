---
framework: qiskit
api_version: 2.5.2
doc_type: error
source_path: qiskit/transpiler/passes/utils/error.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/utils/error.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/utils/error.py`

Error pass to be called when an error happens.

## `Error`

```python
class Error(AnalysisPass)
```

Error pass to be called when an error happens.

### `__init__`

```python
def __init__(self, msg=None, action='raise')
```

Error pass.

Args:
    msg (str | Callable[[PropertySet], str]): Error message, if not provided a generic error
        will be used.  This can be either a raw string, or a callback function that accepts
        the current ``property_set`` and returns the desired message.
    action (str): the action to perform. Default: 'raise'. The options are:
      * ``'raise'``: Raises a ``TranspilerError`` exception with msg
      * ``'warn'``: Raises a non-fatal warning with msg
      * ``'log'``: logs in ``logging.getLogger(__name__)``

Raises:
    TranspilerError: if action is not valid.

### `run`

```python
def run(self, _)
```

Run the Error pass on `dag`.
