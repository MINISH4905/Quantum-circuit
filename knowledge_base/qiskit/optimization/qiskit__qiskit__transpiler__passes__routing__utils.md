---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/routing/utils.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/routing/utils.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/routing/utils.py`

Utility functions for routing

## `get_swap_map_dag`

```python
def get_swap_map_dag(dag, coupling_map, from_layout, to_layout, seed, trials=4)
```

Get the circuit of swaps to go from from_layout to to_layout, and the physical qubits
(integers) that the swap circuit should be applied on.
