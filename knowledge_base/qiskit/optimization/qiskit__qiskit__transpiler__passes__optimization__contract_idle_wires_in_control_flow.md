---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/contract_idle_wires_in_control_flow.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/contract_idle_wires_in_control_flow.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/contract_idle_wires_in_control_flow.py`

Contract control-flow operations that contain idle wires.

## `ContractIdleWiresInControlFlow`

```python
class ContractIdleWiresInControlFlow(TransformationPass)
```

Remove idle qubits from control-flow operations of a :class:`.DAGCircuit`.
