---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/basis/decompose.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/basis/decompose.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/basis/decompose.py`

Expand a gate in a circuit using its decomposition rules.

## `Decompose`

```python
class Decompose(TransformationPass)
```

Expand a gate in a circuit using its decomposition rules.

### `__init__`

```python
def __init__(self, gates_to_decompose: str | type[Instruction] | Sequence[str | type[Instruction]] | None=None, apply_synthesis: bool=False) -> None
```

Args:
    gates_to_decompose: optional subset of gates to be decomposed,
        identified by gate label, name or type. Defaults to all gates.
    apply_synthesis: If ``True``, run :class:`.HighLevelSynthesis` to synthesize operations
        that do not have a definition attached.

### `run`

```python
def run(self, dag: DAGCircuit) -> DAGCircuit
```

Run the Decompose pass on `dag`.

Args:
    dag: input dag.

Returns:
    output dag where ``gate`` was expanded.
