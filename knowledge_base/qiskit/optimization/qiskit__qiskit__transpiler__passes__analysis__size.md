---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/analysis/size.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/analysis/size.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/analysis/size.py`

Calculate the size of a DAG circuit.

## `Size`

```python
class Size(AnalysisPass)
```

Calculate the size of a DAG circuit.

The result is saved in ``property_set['size']`` as an integer.

### `__init__`

```python
def __init__(self, *, recurse: bool=False) -> None
```

Args:
    recurse: whether to allow recursion into control flow.  If this is ``False`` (default),
        the pass will throw an error when control flow is present, to avoid returning a
        number with little meaning.

### `run`

```python
def run(self, dag: DAGCircuit) -> None
```

Run the Size pass on ``dag``.
