---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/layout/layout_2q_distance.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/layout/layout_2q_distance.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/layout/layout_2q_distance.py`

Evaluate how good the layout selection was.

No CX direction is considered.
Saves in `property_set['layout_score']` the sum of distances for each circuit CX.
The lower the number, the better the selection.
Therefore, 0 is a perfect layout selection.

## `Layout2qDistance`

```python
class Layout2qDistance(AnalysisPass)
```

Evaluate how good the layout selection was.

Saves in ``property_set['layout_score']`` (or the property name in property_name)
the sum of distances for each circuit CX.
The lower the number, the better the selection. Therefore, 0 is a perfect layout selection.
No CX direction is considered.

### `__init__`

```python
def __init__(self, coupling_map, property_name='layout_score')
```

Layout2qDistance initializer.

Args:
    coupling_map (Union[CouplingMap, Target]): Directed graph representing a coupling map.
    property_name (str): The property name to save the score. Default: layout_score

### `run`

```python
def run(self, dag)
```

Run the Layout2qDistance pass on `dag`.
Args:
    dag (DAGCircuit): DAG to evaluate.
