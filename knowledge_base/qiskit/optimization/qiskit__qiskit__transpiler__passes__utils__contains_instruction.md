---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/utils/contains_instruction.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/utils/contains_instruction.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/utils/contains_instruction.py`

Check if the DAG contains a specific instruction.

## `ContainsInstruction`

```python
class ContainsInstruction(AnalysisPass)
```

An analysis pass to detect if the DAG contains a specific instruction.

This pass takes in a single instruction name for example ``'delay'`` and
will set the property set ``contains_delay`` to ``True`` if the DAG contains
that instruction and ``False`` if it does not.

### `__init__`

```python
def __init__(self, instruction_name: str | Iterable[str], recurse: bool=True) -> None
```

Args:
    instruction_name: The instruction or instructions to check are in
        the DAG. The output in the property set is set to ``contains_`` prefixed on each
        value for this parameter.
    recurse: if ``True`` (default), then recurse into control-flow operations.

### `run`

```python
def run(self, dag: DAGCircuit) -> None
```

Run the ContainsInstruction pass on ``dag``.
