---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/io/qasm_interpreter.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/io/qasm_interpreter.py
license: Apache-2.0
---

## Error surface of `pennylane/io/qasm_interpreter.py`

### Exceptions

## `BreakException`

```python
class BreakException(Exception)
```

Exception raised when encountering a break statement.

## `ContinueException`

```python
class ContinueException(Exception)
```

Exception raised when encountering a continue statement.

## `EndProgram`

```python
class EndProgram(Exception)
```

Exception raised when it encounters an end statement in the QASM circuit.
