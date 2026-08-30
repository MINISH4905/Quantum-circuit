---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/hoare_opt.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/hoare_opt.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/hoare_opt.py`

Pass for Hoare logic circuit optimization.

## `HoareOptimizer`

```python
class HoareOptimizer(TransformationPass)
```

This is a transpiler pass using Hoare logic circuit optimization.
The inner workings of this are detailed in:
https://arxiv.org/abs/1810.00375

### `__init__`

```python
def __init__(self, size=10)
```

Args:
    size (int): size of gate cache, in number of gates
Raises:
    MissingOptionalLibraryError: if unable to import z3 solver

### `run`

```python
def run(self, dag)
```

Args:
    dag (DAGCircuit): the directed acyclic graph to run on.
Returns:
    DAGCircuit: Transformed DAG.
