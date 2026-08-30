---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/utils/gates_basis.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/utils/gates_basis.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/utils/gates_basis.py`

Check if all gates in the DAGCircuit are in the specified basis gates.

## `GatesInBasis`

```python
class GatesInBasis(AnalysisPass)
```

Check if all gates in a DAG are in a given set of gates

### `__init__`

```python
def __init__(self, basis_gates=None, target=None)
```

Initialize the GatesInBasis pass.

Args:
    basis_gates (list): The list of strings representing the set of basis gates.
    target (Target): The target representing the backend. If specified
        this will be used instead of the ``basis_gates`` parameter

### `run`

```python
def run(self, dag)
```

Run the GatesInBasis pass on `dag`.
