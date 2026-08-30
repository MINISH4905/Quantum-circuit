---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/routing/basic_swap.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/routing/basic_swap.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/routing/basic_swap.py`

Map (with minimum effort) a DAGCircuit onto a ``coupling_map`` adding swap gates.

## `BasicSwap`

```python
class BasicSwap(TransformationPass)
```

Map (with minimum effort) a DAGCircuit onto a ``coupling_map`` adding swap gates.

The basic mapper is a minimum effort to insert swap gates to map the DAG onto
a coupling map. When a cx is not in the coupling map possibilities, it inserts
one or more swaps in front to make it compatible.

### `__init__`

```python
def __init__(self, coupling_map, fake_run=False)
```

BasicSwap initializer.

Args:
    coupling_map (Union[CouplingMap, Target]): Directed graph representing a coupling map.
    fake_run (bool): if true, it will only pretend to do routing, i.e., no
        swap is effectively added.

### `run`

```python
def run(self, dag)
```

Run the BasicSwap pass on `dag`.

Args:
    dag (DAGCircuit): DAG to map.

Returns:
    DAGCircuit: A mapped DAG.

Raises:
    TranspilerError: if the coupling map or the layout are not
    compatible with the DAG, or if the ``coupling_map=None``.
