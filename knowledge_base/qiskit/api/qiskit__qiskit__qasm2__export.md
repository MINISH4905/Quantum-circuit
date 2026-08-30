---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/qasm2/export.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/qasm2/export.py
license: Apache-2.0
---

## Module `qiskit/qasm2/export.py`

Export tools for OpenQASM 2.

## `dump`

```python
def dump(circuit: QuantumCircuit, filename_or_stream: os.PathLike | io.TextIOBase, /)
```

Dump a circuit as an OpenQASM 2 program to a file or stream.

Args:
    circuit: the :class:`.QuantumCircuit` to be exported.
    filename_or_stream: either a path-like object (likely a :class:`str` or
        :class:`pathlib.Path`), or an already opened text-mode stream.

Raises:
    QASM2ExportError: if the circuit cannot be represented by OpenQASM 2.

## `dumps`

```python
def dumps(circuit: QuantumCircuit, /) -> str
```

Export a circuit to an OpenQASM 2 program in a string.

Args:
    circuit: the :class:`.QuantumCircuit` to be exported.

Returns:
    An OpenQASM 2 string representing the circuit.

Raises:
    QASM2ExportError: if the circuit cannot be represented by OpenQASM 2.
