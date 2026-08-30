---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/remove_reset_in_zero_state.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/remove_reset_in_zero_state.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/remove_reset_in_zero_state.py`

Remove reset gate when the qubit is in zero state.

## `RemoveResetInZeroState`

```python
class RemoveResetInZeroState(TransformationPass)
```

Remove reset gate when the qubit is in zero state.

### `run`

```python
def run(self, dag)
```

Run the RemoveResetInZeroState pass on `dag`.

Args:
    dag (DAGCircuit): the DAG to be optimized.

Returns:
    DAGCircuit: the optimized DAG.
