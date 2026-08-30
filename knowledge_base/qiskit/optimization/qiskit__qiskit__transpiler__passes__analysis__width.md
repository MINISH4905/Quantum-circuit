---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/analysis/width.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/analysis/width.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/analysis/width.py`

Calculate the width of a DAG circuit.

## `Width`

```python
class Width(AnalysisPass)
```

Calculate the width of a DAG circuit.

The result is saved in ``property_set['width']`` as an integer that
contains the number of qubits + the number of clbits.

### `run`

```python
def run(self, dag: DAGCircuit) -> None
```

Run the Width pass on ``dag``.
