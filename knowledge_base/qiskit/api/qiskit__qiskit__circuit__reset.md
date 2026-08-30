---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/reset.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/reset.py
license: Apache-2.0
---

## Module `qiskit/circuit/reset.py`

Qubit reset to computational zero.

## `Reset`

```python
class Reset(SingletonInstruction)
```

Incoherently reset a qubit to the :math:`\lvert0\rangle` state.

### `__init__`

```python
def __init__(self, label=None)
```

Args:
    label: optional string label of this instruction.
