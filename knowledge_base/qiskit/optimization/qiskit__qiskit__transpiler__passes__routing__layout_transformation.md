---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/routing/layout_transformation.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/routing/layout_transformation.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/routing/layout_transformation.py`

Map (with minimum effort) a DAGCircuit onto a ``coupling_map`` adding swap gates.

## `LayoutTransformation`

```python
class LayoutTransformation(TransformationPass)
```

Adds a Swap circuit for a given (partial) permutation to the circuit.

This circuit is found by a 4-approximation algorithm for Token Swapping.
More details are available in the routing code.

### `__init__`

```python
def __init__(self, coupling_map: CouplingMap | Target | None, from_layout: Layout | str, to_layout: Layout | str, seed: int | np.random.Generator | None=None, trials=4)
```

LayoutTransformation initializer.

Args:
    coupling_map:
        Directed graph representing a coupling map.

    from_layout (Union[Layout, str]):
        The starting layout of qubits onto physical qubits.
        If the type is str, look up `property_set` when this pass runs.

    to_layout (Union[Layout, str]):
        The final layout of qubits on physical qubits.
        If the type is str, look up ``property_set`` when this pass runs.

    seed (Union[int, np.random.default_rng]):
        Seed to use for random trials.

    trials (int):
        How many randomized trials to perform, taking the best circuit as output.

### `run`

```python
def run(self, dag)
```

Apply the specified partial permutation to the circuit.

Args:
    dag (DAGCircuit): DAG to transform the layout of.

Returns:
    DAGCircuit: The DAG with transformed layout.

Raises:
    TranspilerError: if the coupling map or the layout are not compatible with the DAG.
        Or if either of string from/to_layout is not found in `property_set`.
