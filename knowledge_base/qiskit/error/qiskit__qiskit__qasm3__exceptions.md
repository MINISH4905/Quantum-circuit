---
framework: qiskit
api_version: 2.5.2
doc_type: error
source_path: qiskit/qasm3/exceptions.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/qasm3/exceptions.py
license: Apache-2.0
---

## Module `qiskit/qasm3/exceptions.py`

Exceptions that may be raised during processing OpenQASM 3.

## `QASM3Error`

```python
class QASM3Error(QiskitError)
```

An error raised while working with OpenQASM 3 representations of circuits.

## `QASM3ExporterError`

```python
class QASM3ExporterError(QASM3Error)
```

An error raised during running the OpenQASM 3 exporter.

## `QASM3ImporterError`

```python
class QASM3ImporterError(QASM3Error)
```

An error raised during the OpenQASM 3 importer.
