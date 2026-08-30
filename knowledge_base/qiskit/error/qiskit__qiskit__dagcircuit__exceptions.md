---
framework: qiskit
api_version: 2.5.2
doc_type: error
source_path: qiskit/dagcircuit/exceptions.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/dagcircuit/exceptions.py
license: Apache-2.0
---

## Module `qiskit/dagcircuit/exceptions.py`

Exception for errors raised by the DAGCircuit object.

## `DAGCircuitError`

```python
class DAGCircuitError(QiskitError)
```

Base class for errors raised by the DAGCircuit object.

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

## `DAGDependencyError`

```python
class DAGDependencyError(QiskitError)
```

Base class for errors raised by the DAGDependency object.

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
