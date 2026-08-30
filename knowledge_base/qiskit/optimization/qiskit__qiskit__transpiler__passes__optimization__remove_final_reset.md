---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/remove_final_reset.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/remove_final_reset.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/remove_final_reset.py`

Remove reset when it is the final instruction on a qubit.

## `RemoveFinalReset`

```python
class RemoveFinalReset(TransformationPass)
```

Remove reset when it is the final instruction on a qubit wire.

### `run`

```python
def run(self, dag)
```

Run the RemoveFinalReset pass on `dag`.

Args:
    dag (DAGCircuit): the DAG to be optimized.

Returns:
    DAGCircuit: the optimized DAG.
