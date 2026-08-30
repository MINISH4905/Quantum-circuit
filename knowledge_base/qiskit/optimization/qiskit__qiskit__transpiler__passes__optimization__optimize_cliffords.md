---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/optimize_cliffords.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/optimize_cliffords.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/optimize_cliffords.py`

Combine consecutive Cliffords over the same qubits.

## `OptimizeCliffords`

```python
class OptimizeCliffords(TransformationPass)
```

Combine consecutive Cliffords over the same qubits.
This serves as an example of extra capabilities enabled by storing
Cliffords natively on the circuit.

### `run`

```python
def run(self, dag)
```

Run the OptimizeCliffords pass on `dag`.

Args:
    dag (DAGCircuit): the DAG to be optimized.

Returns:
    DAGCircuit: the optimized DAG.
