---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/layout/full_ancilla_allocation.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/layout/full_ancilla_allocation.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/layout/full_ancilla_allocation.py`

Allocate all idle nodes from the coupling map as ancilla on the layout.

## `FullAncillaAllocation`

```python
class FullAncillaAllocation(AnalysisPass)
```

Allocate all idle nodes from the coupling map or target as ancilla on the layout.

A pass for allocating all idle physical qubits (those that exist in coupling
map or target but not the dag circuit) as ancilla. It will also choose new
virtual qubits to correspond to those physical ancilla.

Note:
    This is an analysis pass, and only responsible for choosing physical
    ancilla locations and their corresponding virtual qubits.
    A separate transformation pass must add those virtual qubits to the
    circuit.

### `__init__`

```python
def __init__(self, coupling_map)
```

FullAncillaAllocation initializer.

Args:
    coupling_map (Union[CouplingMap, Target]): directed graph representing a coupling map.

### `run`

```python
def run(self, dag)
```

Run the FullAncillaAllocation pass on `dag`.

Extend the layout with new (physical qubit, virtual qubit) pairs.
The dag signals which virtual qubits are already in the circuit.
This pass will allocate new virtual qubits such that no collision occurs
(i.e. Layout bijectivity is preserved)

The coupling_map and layout together determine which physical qubits are free.

Args:
    dag (DAGCircuit): circuit to analyze

Returns:
    DAGCircuit: returns the same dag circuit, unmodified

Raises:
    TranspilerError: If there is no layout in the property set or not set at init time.

### `validate_layout`

```python
def validate_layout(layout_qubits, dag_qubits)
```

Checks if all the qregs in ``layout_qregs`` already exist in ``dag_qregs``. Otherwise, raise.
