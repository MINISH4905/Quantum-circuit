---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/collect_2q_blocks.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/collect_2q_blocks.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/collect_2q_blocks.py`

Collect sequences of uninterrupted gates acting on 2 qubits.

## `Collect2qBlocks`

```python
class Collect2qBlocks(AnalysisPass)
```

Collect two-qubit subcircuits.

### `__init__`

```python
def __init__(self, filter_fn: Callable[[DAGCircuit, list[DAGOpNode]], bool] | None=None)
```

Args:
    filter_fn: An optional function that filters collected two-qubit blocks.

### `run`

```python
def run(self, dag)
```

Run the Collect2qBlocks pass on `dag`.

The blocks contain "op" nodes in topological order such that all gates
in a block act on the same qubits, are adjacent in the circuit, and
satisfy the filtering condition (when specified).

After the execution, ``property_set['block_list']`` is set to a list of
tuples of "op" node.
