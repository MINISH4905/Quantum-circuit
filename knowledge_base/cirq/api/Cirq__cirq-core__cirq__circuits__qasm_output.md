---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/circuits/qasm_output.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/circuits/qasm_output.py
license: Apache-2.0
---

## Module `cirq-core/cirq/circuits/qasm_output.py`

Utility classes for representing QASM.

## `QasmOutput`

```python
class QasmOutput
```

Representation of a circuit in QASM (quantum assembly) format.

Please note that the QASM importer is in an experimental state and
currently only supports a subset of the full OpenQASM spec.
Amongst others, classical control, arbitrary gate definitions,
and even some of the gates that don't have a one-to-one representation
in Cirq, are not yet supported.

QASM output can be saved to a file using the save method.

### `__init__`

```python
def __init__(self, operations: cirq.OP_TREE, qubits: tuple[cirq.Qid, ...], header: str='', precision: int=10, version: str='2.0') -> None
```

Representation of a circuit in QASM format.

Args:
    operations: Tree of operations to insert.
    qubits: The qubits used in the operations.
    header: A multi-line string that is placed in a comment at the top
        of the QASM.
    precision: The number of digits after the decimal to show for
        numbers in the QASM code.
    version: The QASM version to target. Objects may return different
        QASM depending on version.

### `is_valid_qasm_id`

```python
def is_valid_qasm_id(self, id_str: str) -> bool
```

Test if id_str is a valid id in QASM grammar.

### `save`

```python
def save(self, path: str | bytes | int) -> None
```

Write QASM output to a file specified by path.

### `__str__`

```python
def __str__(self) -> str
```

Return QASM output as a string.
