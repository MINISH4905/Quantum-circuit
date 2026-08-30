---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/routing/commuting_2q_gate_routing/commuting_2q_block.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/routing/commuting_2q_gate_routing/commuting_2q_block.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/routing/commuting_2q_gate_routing/commuting_2q_block.py`

A gate made of commuting two-qubit gates.

## `Commuting2qBlock`

```python
class Commuting2qBlock(Gate)
```

A gate made of commuting two-qubit gates.

This gate is intended for use with commuting swap strategies to make it convenient
for the swap strategy router to identify which blocks of operations commute.

### `__init__`

```python
def __init__(self, node_block: Iterable[DAGOpNode]) -> None
```

Args:
    node_block: A block of nodes that commute.

Raises:
    QiskitError: If the nodes in the node block do not apply to two-qubits.

### `__iter__`

```python
def __iter__(self)
```

Iterate through the nodes in the block.
