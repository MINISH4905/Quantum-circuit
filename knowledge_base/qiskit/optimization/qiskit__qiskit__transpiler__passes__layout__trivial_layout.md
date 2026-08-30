---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/layout/trivial_layout.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/layout/trivial_layout.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/layout/trivial_layout.py`

Choose a Layout by assigning ``n`` circuit qubits to device qubits ``0, .., n-1``.

## `TrivialLayout`

```python
class TrivialLayout(AnalysisPass)
```

Choose a Layout by assigning ``n`` circuit qubits to device qubits ``0, .., n-1``.

A pass for choosing a Layout of a circuit onto a Coupling graph, using a simple
round-robin order.

This pass associates a physical qubit (int) to each virtual qubit
of the circuit (Qubit) in increasing order.

Does not assume any ancilla.

### `__init__`

```python
def __init__(self, coupling_map)
```

TrivialLayout initializer.

Args:
    coupling_map (Union[CouplingMap, Target]): directed graph representing a coupling map.

Raises:
    TranspilerError: if invalid options

### `run`

```python
def run(self, dag)
```

Run the TrivialLayout pass on `dag`.

Args:
    dag (DAGCircuit): DAG to find layout for.

Raises:
    TranspilerError: if dag wider than the target backend
