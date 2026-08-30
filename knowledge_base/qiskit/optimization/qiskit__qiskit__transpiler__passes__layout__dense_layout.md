---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/layout/dense_layout.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/layout/dense_layout.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/layout/dense_layout.py`

Choose a Layout by finding the most connected subset of qubits.

## `DenseLayout`

```python
class DenseLayout(AnalysisPass)
```

Choose a Layout by finding the most connected subset of qubits.

This pass associates a physical qubit (int) to each virtual qubit
of the circuit (Qubit).

Note:
    Even though a ``'layout'`` is not strictly a property of the DAG,
    in the transpiler architecture it is best passed around between passes
    by being set in ``property_set``.

### `__init__`

```python
def __init__(self, coupling_map=None, target=None)
```

DenseLayout initializer.

Args:
    coupling_map (Coupling): directed graph representing a coupling map.
    target (Target): A target representing the target backend.

### `run`

```python
def run(self, dag)
```

Run the DenseLayout pass on `dag`.

Pick a convenient layout depending on the best matching
qubit connectivity, and set the property `layout`.

Args:
    dag (DAGCircuit): DAG to find layout for.

Raises:
    TranspilerError: if dag wider than self.coupling_map
