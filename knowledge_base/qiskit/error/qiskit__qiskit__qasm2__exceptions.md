---
framework: qiskit
api_version: 2.5.2
doc_type: error
source_path: qiskit/qasm2/exceptions.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/qasm2/exceptions.py
license: Apache-2.0
---

## Module `qiskit/qasm2/exceptions.py`

Exception definitions for the OQ2 module.

## `QASM2Error`

```python
class QASM2Error(QiskitError)
```

A general error raised by the OpenQASM 2 interoperation layer.

## `QASM2ParseError`

```python
class QASM2ParseError(QASM2Error)
```

An error raised because of a failure to parse an OpenQASM 2 file.

## `QASM2ExportError`

```python
class QASM2ExportError(QASM2Error)
```

An error raised because of a failure to convert a Qiskit object to an OpenQASM 2 form.
