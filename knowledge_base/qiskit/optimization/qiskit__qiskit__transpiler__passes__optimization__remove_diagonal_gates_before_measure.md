---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/remove_diagonal_gates_before_measure.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/remove_diagonal_gates_before_measure.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/remove_diagonal_gates_before_measure.py`

Remove diagonal gates (including diagonal 2Q gates) before a measurement.

## `RemoveDiagonalGatesBeforeMeasure`

```python
class RemoveDiagonalGatesBeforeMeasure(TransformationPass)
```

Remove diagonal gates (including diagonal 2Q gates) before a measurement.

Transpiler pass to remove diagonal gates (like RZ, T, Z, etc) before
a measurement. Including diagonal 2Q gates.

### `run`

```python
def run(self, dag)
```

Run the RemoveDiagonalGatesBeforeMeasure pass on `dag`.

Args:
    dag (DAGCircuit): the DAG to be optimized.

Returns:
    DAGCircuit: the optimized DAG.
