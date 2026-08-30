---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/layout/set_layout.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/layout/set_layout.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/layout/set_layout.py`

Set the ``layout`` property to the given layout.

## `SetLayout`

```python
class SetLayout(AnalysisPass)
```

Set the ``layout`` property to the given layout.

This pass associates a physical qubit (int) to each virtual qubit
of the circuit (Qubit) in increasing order.

### `__init__`

```python
def __init__(self, layout)
```

SetLayout initializer.

Args:
    layout (Layout or List[int]): the layout to set. It can be:

        * a :class:`Layout` instance: sets that layout.
        * a list of integers: takes the index in the list as the physical position in which the
          virtual qubit is going to be mapped.

### `run`

```python
def run(self, dag)
```

Run the SetLayout pass on ``dag``.

Args:
    dag (DAGCircuit): DAG to map.

Returns:
    DAGCircuit: the original DAG.
