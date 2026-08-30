---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/controlflow/break_loop.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/controlflow/break_loop.py
license: Apache-2.0
---

## Module `qiskit/circuit/controlflow/break_loop.py`

Circuit operation representing a ``break`` from a loop.

## `BreakLoopOp`

```python
class BreakLoopOp(Instruction)
```

A circuit operation which, when encountered, jumps to the end of the nearest enclosing loop.
Can only be used inside loops.

### `__init__`

```python
def __init__(self, num_qubits: int, num_clbits: int, label: str | None=None)
```

Args:
    num_qubits: the number of qubits this affects.
    num_clbits: the number of clbits this affects.
    label: an optional string label for the instruction.

## `BreakLoopPlaceholder`

```python
class BreakLoopPlaceholder(InstructionPlaceholder)
```

A placeholder instruction for use in control-flow context managers, when the number of qubits
and clbits is not yet known.

.. warning::

    This is an internal interface and no part of it should be relied upon outside of Qiskit
    Terra.
