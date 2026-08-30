---
framework: qiskit
api_version: 2.5.2
doc_type: error
source_path: qiskit/transpiler/exceptions.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/exceptions.py
license: Apache-2.0
---

## Module `qiskit/transpiler/exceptions.py`

Exception for errors raised by the transpiler.

## `TranspilerAccessError`

```python
class TranspilerAccessError(PassManagerError)
```

DEPRECATED: Exception of access error in the transpiler passes.

## `TranspilerError`

```python
class TranspilerError(TranspilerAccessError)
```

Exceptions raised during transpilation.

## `CouplingError`

```python
class CouplingError(QiskitError)
```

Base class for errors raised by the coupling graph object.

### `__init__`

```python
def __init__(self, *msg)
```

Set the error message.

### `__str__`

```python
def __str__(self)
```

Return the message.

## `LayoutError`

```python
class LayoutError(QiskitError)
```

Errors raised by the layout object.

### `__init__`

```python
def __init__(self, *msg)
```

Set the error message.

### `__str__`

```python
def __str__(self)
```

Return the message.

## `CircuitTooWideForTarget`

```python
class CircuitTooWideForTarget(TranspilerError)
```

Error raised if the circuit is too wide for the target.

## `InvalidLayoutError`

```python
class InvalidLayoutError(TranspilerError)
```

Error raised when a user provided layout is invalid.
