---
framework: qiskit
api_version: 2.5.2
doc_type: error
source_path: qiskit/qpy/exceptions.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/qpy/exceptions.py
license: Apache-2.0
---

## Module `qiskit/qpy/exceptions.py`

Exception for errors raised by the QPY module.

## `QpyError`

```python
class QpyError(QiskitError)
```

Errors raised by the qpy module.

### `__init__`

```python
def __init__(self, *message)
```

Set the error message.

### `__str__`

```python
def __str__(self)
```

Return the message.

## `UnsupportedFeatureForVersion`

```python
class UnsupportedFeatureForVersion(QpyError)
```

QPY error raised when the target dump version is too low for a feature that is present in the
object to be serialized.

### `__init__`

```python
def __init__(self, feature: str, required: int, target: int)
```

Args:
    feature: a description of the problematic feature.
    required: the minimum version of QPY that would be required to represent this
        feature.
    target: the version of QPY that is being used in the serialization.

## `QPYLoadingDeprecatedFeatureWarning`

```python
class QPYLoadingDeprecatedFeatureWarning(QiskitWarning)
```

Visible deprecation warning for QPY loading functions without
a stable point in the call stack.
