---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/layout/disjoint_utils.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/layout/disjoint_utils.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/layout/disjoint_utils.py`

This module contains common utils for disjoint coupling maps.

## `require_layout_isolated_to_component`

```python
def require_layout_isolated_to_component(dag: DAGCircuit, components_source: Target | CouplingMap)
```

Check that the layout of the dag does not require connectivity across connected components
in the CouplingMap

Args:
    dag: DAGCircuit to check.
    components_source: Target to check against.

Raises:
    TranspilerError: Chosen layout is not valid for the target disjoint connectivity.
