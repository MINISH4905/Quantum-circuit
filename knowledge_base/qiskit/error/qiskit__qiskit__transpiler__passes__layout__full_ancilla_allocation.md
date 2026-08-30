---
framework: qiskit
api_version: 2.5.2
doc_type: error
source_path: qiskit/transpiler/passes/layout/full_ancilla_allocation.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/layout/full_ancilla_allocation.py
license: Apache-2.0
---

## Error surface of `qiskit/transpiler/passes/layout/full_ancilla_allocation.py`

### Validation

### `FullAncillaAllocation.validate_layout`

```python
def validate_layout(layout_qubits, dag_qubits)
```

Checks if all the qregs in ``layout_qregs`` already exist in ``dag_qregs``. Otherwise, raise.
