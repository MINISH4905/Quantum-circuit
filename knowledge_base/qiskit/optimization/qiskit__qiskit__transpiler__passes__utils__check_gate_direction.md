---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/utils/check_gate_direction.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/utils/check_gate_direction.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/utils/check_gate_direction.py`

Check if the gates follow the right direction with respect to the coupling map.

## `CheckGateDirection`

```python
class CheckGateDirection(AnalysisPass)
```

Check if the two-qubit gates follow the right direction with
respect to the coupling map.

### `__init__`

```python
def __init__(self, coupling_map, target=None)
```

CheckGateDirection initializer.

Args:
    coupling_map (CouplingMap): Directed graph representing a coupling map.
    target (Target): The backend target to use for this pass. If this is specified
        it will be used instead of the coupling map

### `run`

```python
def run(self, dag)
```

Run the CheckGateDirection pass on `dag`.

If `dag` is mapped and the direction is correct the property
`is_direction_mapped` is set to True (or to False otherwise).

Args:
    dag (DAGCircuit): DAG to check.
